import { Injectable } from '@nestjs/common'
import queryString from 'qs'
import _ from 'lodash'
import { IUseCase } from '@common/types'
import { User } from '@modules/users/models'
import { UserRepository } from '@modules/users/repositories'
import { GoogleAuthSignUpDto } from '@modules/users/dto'
import { CreateUserInput, AuthUserObject, BaseAuthFlowUseCaseInput } from '@modules/users/types'

export type AuthSignUpParams = BaseAuthFlowUseCaseInput

@Injectable()
export class BaseAuthFlowUseCase implements IUseCase<BaseAuthFlowUseCaseInput, User> {
  private identityFields = [
    'email',
    'verified_email',
    'name',
    'given_name',
    'family_name',
    'picture',
    'locale',
    'timezone',
    'gender'
  ]

  constructor(private readonly userRepository: UserRepository) {}

  public async execute(baseInput: BaseAuthFlowUseCaseInput): Promise<User> {
    const { identity, authDto, signUpDto } = baseInput
    const isGoogle = signUpDto instanceof GoogleAuthSignUpDto

    const referralInput = signUpDto.referral || ''
    const referrals = this.parseReferral(referralInput)

    const profile: CreateUserInput = {
      name: identity?.name || identity.displayName,
      email: identity?.email,
      photoUrl: identity?.picture,
      autoJoin: referrals?.autojoin || 'auto',
      ...(isGoogle && { googleId: String(identity.id) }),
      ...(signUpDto.timezone && { timezone: signUpDto.timezone })
    }

    if (!isGoogle) {
      profile.outlookId = String(identity.id)
    }

    const serviceData: AuthUserObject = {
      accessToken: authDto.accessToken,
      refreshToken: authDto.refreshToken,
      idToken: authDto.idToken,
      expiresAt: Date.now() + 1000 * parseInt(authDto.expiresIn, 10),
      scope: authDto.scope ? authDto.scope?.split(' ') : [],
      email: identity?.email || identity.mail,
      name: identity?.name || identity.displayName,
      isGoogle,
      isMsOffice: !isGoogle
    }

    // add identity fields
    Object.assign(serviceData, _.pick(identity, this.identityFields))
    const user = await this.userRepository.createOrUpdateUser(profile, serviceData)
    return user
  }

  private parseReferral(referral: string | null) {
    const defaults = {
      autojoin: '',
      txReferral: '',
      siteReferral: '',
      userReferral: '',
      teamReferral: '',
      linkRef: []
    }
    if (referral == null || referral.length > 0) {
      return null
    }
    const params = queryString.parse(referral)
    const {
      l: linkRefArray,
      s: siteReferral,
      t: txReferral,
      u: userReferral,
      r: teamReferral
    } = params
    defaults.autojoin = txReferral ? 'manual' : 'auto'
    if (txReferral) {
      defaults.txReferral = txReferral as string
    }
    if (siteReferral) {
      defaults.siteReferral = siteReferral as string
    }
    if (userReferral) {
      defaults.userReferral = userReferral as string
    }
    if (teamReferral) {
      defaults.teamReferral = teamReferral as string
    }
    if (linkRefArray) {
      defaults.linkRef = [].concat(linkRefArray as [])
    }
    return defaults
  }
}
