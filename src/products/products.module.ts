import { Module               } from '@nestjs/common';
import { TypeOrmModule        } from '@nestjs/typeorm';
import { ProductsService      } from './products.service';
import { ProductsController   } from './products.controller';
import { Product, ProductImage} from './entities';
import { AuthModule           } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers  : [ProductsService],
                //Aqui indicas a TypeORM las entidades para que las cree en la BD
  imports    : [TypeOrmModule.forFeature([Product, ProductImage]), AuthModule],
  exports    : [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
