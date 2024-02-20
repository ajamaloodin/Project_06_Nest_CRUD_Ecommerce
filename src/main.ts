
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
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

  await app.listen(process.env.PORT);
  logger.log(`Server Running on Port ${process.env.PORT}`.cyan.bold);
}
bootstrap();
