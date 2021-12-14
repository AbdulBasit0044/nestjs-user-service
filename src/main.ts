import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { MicroserviceOptions } from '@nestjs/microservices'
import _ from 'newrelic'
import { GRPC_URL, PORT } from '@common/constants'
import { getGrpcOptions } from '@modules/grpc'
import { AppModule } from './app.module'

// Needed to transform the date into iso string in grpc
Date.prototype.toString = Date.prototype.toISOString

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  })
  const options = new DocumentBuilder().setTitle('Users docs').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document)

  app.connectMicroservice<MicroserviceOptions>(getGrpcOptions(GRPC_URL))

  await app.startAllMicroservices()
  await app.listen(PORT, () => {
    Logger.log(`Server running at: http://localhost:${PORT}`)
  })
}

bootstrap()
