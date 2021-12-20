import { Global, Module, ModuleMetadata, Provider } from '@nestjs/common'
import { JwtModule as NestJwtModule } from '@nestjs/jwt'
import { TOKEN_VERIFIER } from '@common/constants'
import { PubSubService } from './services'

export const jwtModule = NestJwtModule.register({
  secret: TOKEN_VERIFIER,
  signOptions: {
    expiresIn: '7d',
    issuer: 'ACME',
    noTimestamp: false
  }
})

type ModuleType = NonNullable<ModuleMetadata['imports']>

const exposedProviders: Provider[] = [PubSubService]

const exposedModules: ModuleType = [jwtModule]

@Global()
@Module({
  imports: [...exposedModules],
  providers: [...exposedProviders],
  exports: [...exposedModules, ...exposedProviders]
})
export class GlobalConfigModule {}
