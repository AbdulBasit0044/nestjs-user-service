import { createHmac, timingSafeEqual } from 'crypto'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Observable } from 'rxjs'
import { BadRequestError } from '@common/errors'
import {
  DIGEST_TYPE,
  HMAC_TYPE,
  HMAC_VERSION,
  SIGNATURE_OLD_MESSAGE_SENT,
  SIGNATURE_VERFICATION_FAILED
} from '@common/constants'
import { AclService } from '@modules/acl/services/acl.service'
import { AclStatus } from '@modules/acl/models'
import { Request } from '../types'

@Injectable()
export class AclGuard implements CanActivate {
  constructor(private readonly aclService: AclService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    switch (context.getType()) {
      case 'http':
        const { headers, body } = context.switchToHttp().getRequest<Request>()
        return this.verifyRequest(headers, body, context.getType())
      case 'rpc':
        const { internalRepr: rpcMetadataMap } = context.switchToRpc().getContext()
        const metadata = {
          'x-fireflies-service': rpcMetadataMap.get('x-fireflies-service')?.[0],
          'x-fireflies-signature': rpcMetadataMap.get('x-fireflies-signature')?.[0],
          'x-fireflies-request-timestamp': rpcMetadataMap.get('x-fireflies-request-timestamp')?.[0]
        }
        return this.verifyRequest(metadata, context.switchToRpc().getData(), context.getType())
    }
    return false
  }

  private async verifyRequest(metadata, body, type) {
    // for grpc, get from metadata
    const service = metadata['X-FIREFLIES-SERVICE'] || metadata['x-fireflies-service']
    const signedRequest = metadata['X-FIREFLIES-SIGNATURE'] || metadata['x-fireflies-signature']
    const timestamp: string =
      metadata['X-FIREFLIES-REQUEST-TIMESTAMP'] || metadata['x-fireflies-request-timestamp']

    if (!service || !signedRequest || !timestamp) {
      throw this.errorBasedOnRequestType('Metadata is not sufficient!', type)
    }

    // for grpc use metadata
    // message comes in
    const [client = '', hash = ''] = signedRequest.split('=')
    const clientId = client.substring(1)

    // TODO: pull secret from redis (where we stored them)
    const acl = await this.aclService.getAclByServiceAndClientId({ service, client_id: clientId })
    if (!acl) {
      throw this.errorBasedOnRequestType('Invalid service access', type)
    }
    if (acl.status !== AclStatus.ACTIVE) {
      throw this.errorBasedOnRequestType('Client has been revoked!', type)
    }

    const { secret: signingSecret } = acl

    // convert current time from milliseconds to seconds
    const timeNow = Math.floor(new Date().getTime() / 1000)
    const timeThen = Math.floor(parseInt(timestamp) / 1000)

    if (Math.abs(timeNow - timeThen) > 300) {
      throw this.errorBasedOnRequestType(SIGNATURE_OLD_MESSAGE_SENT, type)
    }

    // use grpc data here in place of req body
    const sigBasestring = `${HMAC_VERSION}:${timestamp}:${JSON.stringify(body)}`
    const hmac = createHmac(HMAC_TYPE, signingSecret)
    hmac.update(sigBasestring)
    const derivedHash = hmac.digest(DIGEST_TYPE)
    if (!timingSafeEqual(Buffer.from(hash, 'utf-8'), Buffer.from(derivedHash, 'utf-8'))) {
      throw this.errorBasedOnRequestType(SIGNATURE_VERFICATION_FAILED, type)
    }
    return true
  }

  private errorBasedOnRequestType(message, type) {
    if (type === 'rpc') return new RpcException({ message })
    return new BadRequestError({ message })
  }
}
