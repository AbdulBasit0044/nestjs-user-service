import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { LogLevel } from '@sentry/types'
import { DomainErrorFilter } from '@common/filters'
import { ValidationPipe } from '@common/pipes'
import { AUTH_MECHANISM, DSN_URL, MONGO_URI, NODE_ENV } from '@common/constants'
import { AuthMiddleware } from '@common/middlewares'
import { LoggingInterceptor, TransformInterceptor } from '@common/interceptors'
import { UserModule } from '@modules/users'
import { GlobalConfigModule } from '@modules/global-configs'
import { HealthModule } from '@modules/health'
import { GrpcModule } from '@modules/grpc'
import { AclModule } from '@modules/acl'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GlobalConfigModule,
    MongooseModule.forRoot(MONGO_URI, {
      authMechanism: AUTH_MECHANISM
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    HealthModule,
    GrpcModule,
    AclModule,
    SentryModule.forRoot({
      debug: false,
      dsn: process.env.DSN_URL || DSN_URL, // This is the url of auth-ff currently being used
      environment: NODE_ENV,
      logLevel: LogLevel.Debug, // based on sentry.io loglevel
      tracesSampleRate: 1.0
    })
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
