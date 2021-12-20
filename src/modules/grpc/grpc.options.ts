import { join } from 'path'
import { GrpcOptions, Transport } from '@nestjs/microservices'

export const getGrpcOptions = (url: string): GrpcOptions => ({
  transport: Transport.GRPC,
  options: {
    url,
    loader: {
      keepCase: true
    },
    package: ['user'],
    protoPath: [join(__dirname, 'user/proto/user.proto')]
  }
})
