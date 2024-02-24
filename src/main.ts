
import { NestFactory                    } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe         } from '@nestjs/common';

import { AppModule                      } from './app.module';

import 'colors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //remueve toda la data basura que envíen en el request
      forbidNonWhitelisted: true,
      //para que en los DTO se haga la conversion de string a number
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true
      // },
    }), //Se pueden colocar pipes separados por ,
  );

  const config = new DocumentBuilder()
    .setTitle('Teslo RESTfull API')
    .setDescription('Testlo Ecommerce built with NestJS')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  logger.log(`Server Running on Port ${process.env.PORT}`.cyan.bold);
}
bootstrap();
