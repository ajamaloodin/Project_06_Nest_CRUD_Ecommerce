import { join } from 'path';

import { Module            } from '@nestjs/common';
import { ConfigModule      } from '@nestjs/config';
import { TypeOrmModule     } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductsModule } from './products/products.module';
import { CommonModule   } from './common/common.module';
import { SeedModule     } from './seed/seed.module';
import { FilesModule    } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { MessageWsModule } from './message-ws/message-ws.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type    : 'postgres',
      host    : process.env.DB_HOST,
      port    : +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,

      autoLoadEntities: true,
      synchronize     : true  // en produccion se coloca en false, ya que lo ideal es que si
                              //si hay cambios en la BD se maneje con analisis y migraciones.

    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
      }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    MessageWsModule,
  ],
  providers: [],
})
export class AppModule {}
