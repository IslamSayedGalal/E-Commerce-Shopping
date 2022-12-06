const multer = require('multer');
const ApiError = require('../utils/apiError');



const multerObject = ()=>{
    // Disk Storage
    // const multerStorage = multer.diskStorage({
    //     destination: function(req,file, cb){
    //         cb(null, 'uploads/categories');
    //     },
    //     filename: function(req, file, cb){
    //         const ext = file.mimetype.split('/')[1];
    //         const fiName = `category-${uuidv4()}-${Date.now()}.${ext}`;
    //         cb(null, fiName);
    //     },
    // });


    const multerStorage = multer.memoryStorage();

    const multerFilter = function(req,file,cb){
        if(file.mimetype.startsWith('image')){
            cb(null, true);
        }else{
            cb(new ApiError("Only Images Allowed", 400), false);
        }
    }

    const upload = multer({storage: multerStorage, fileFilter: multerFilter });
    return upload;
}



exports.uploadSingleImage = (fieldName)=>
    multerObject().single(fieldName);


exports.uploadMixOfImages = (arrayOfFields) =>
    multerObject().fields(arrayOfFields);