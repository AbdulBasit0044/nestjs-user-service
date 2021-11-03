import { NestFactory } from '@nestjs/core'
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { CommandModule, CommandService } from 'nestjs-command'
import { AuthMiddleware } from '@common/middlewares'
import { UserModule } from '@modules/users'
import { GlobalConfigModule } from '@modules/global-configs'
import { SeedsModule } from '@modules/seeds/seeds.module'

const { NODE_ENV, MONGO_URI = '127.0.0.1' } = process.env
@Module({
  imports: [
    GlobalConfigModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(MONGO_URI),
    EventEmitterModule.forRoot(),
    UserModule,
    SeedsModule
  ],
  providers: []
})
class AppDevModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}

async function bootstrap() {
  if (NODE_ENV && NODE_ENV !== 'dev' && NODE_ENV !== 'test') {
    Logger.error('Environment should be dev or test! Exiting...')
    process.exit(1)
  }

  if (MONGO_URI && !MONGO_URI.includes('localhost') && !MONGO_URI.includes('127.0.0.1')) {
    Logger.error('Database should be set to local! Exiting...')
    process.exit(1)
  }

  const app = await NestFactory.createApplicationContext(AppDevModule, {
    logger: false
  })

  try {
    await app.select(CommandModule).get(CommandService).exec()
    await app.close()
  } catch (error) {
    Logger.error(error)
    await app.close()
    process.exit(1)
  }
}

bootstrap()
