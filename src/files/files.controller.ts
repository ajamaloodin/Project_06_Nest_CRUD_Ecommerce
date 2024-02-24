import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, BadRequestException, Param, Res } from '@nestjs/common';
import { ConfigService   } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags         } from '@nestjs/swagger';

import { Response              } from 'express'
import { diskStorage           } from 'multer';
import { FilesService          } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
              private readonly configService: ConfigService,
    ) {}

  @Get('product/:imageName')
  findProductImage(
    //con este decorador le decimos a Nest que no tome él el control de la respuesta,
    //sino que lo vamos a manejar con esta funcion
    @Res() res: Response,
    @Param('imageName') imageName: string
    ) {

    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path );
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', { fileFilter: fileFilter, //limits: {fileSize: 50000}
  // No es correcto almacenar los archivos estaticos (imagenes, etc) en el filesystem o en el mismo servidor 
  // donde está desplegada el server. Lo ideal es tenerlas en un servicio de terceros como: AWS S3
  // Aquí se hizo así por temas netamente didacticos.
                                               storage: diskStorage( {destination: './static/product',
                                               filename: fileNamer } )}) )
  uploadProductImages( @UploadedFile() file: Express.Multer.File) {
    
    //si no llega el archivo quiere decir que el interceptor falló en la validación del Filter
    if (!file) {
      throw new BadRequestException('File is not a valid file');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${ file.filename }`;

    return secureUrl;

  }
}

function getStaticProductImage(imageName: string) {
  throw new Error('Function not implemented.');
}
