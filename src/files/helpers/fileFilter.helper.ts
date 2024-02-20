

export const fileFilter = (req: Express.Request, file: Express.Multer.File,
                            callback: Function ) => {

    // si el archivo no ha venido en la petición se llama al callback con el error y el false
    // indicando que no se está aceptando el archivo
    //  problema de este error es que genera un 500 si no se maneja el return el lado del ctrller
    if ( !file ) return callback( new Error('No file was received. File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (validExtensions.includes( fileExtension )) {
        return callback(null, true);
    }
    
    return callback(null, false);
}