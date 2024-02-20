import { v4 as uuid } from 'uuid';

export const fileNamer = (req: Express.Request, file: Express.Multer.File,
                            callback: Function ) => {

    //Esta validación debería ser innecesaria porque se supone que ya hemos validado que 
    //tenemos un archivo válido, pero la dejamos por si acaso...
    if ( !file ) return callback( new Error('No file was received. File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    
    //generamos un nombre de archivo unico (con UUID) concatenando la extension
    const fileName = `${ uuid() }.${fileExtension}`;
    
    return callback(null, fileName);
}