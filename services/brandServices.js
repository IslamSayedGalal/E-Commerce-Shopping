const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');

const BrandModel = require('../models/brandModel');
const handlerFactory = require('./handlerFactory');
const {uploadSingleImage} = require('../middleware/uploadImageMiddleWare');


// @desc    Upload Image
exports.uploadBrandImage = uploadSingleImage('image');

// @desc    Image Processing
exports.resizeImage = asyncHandler(async (req,res,next)=>{
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    // console.log(`brand-${uuidv4()}-${Date.now()}.jpeg`);
    await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90})
            .toFile(`uploads/brands/${filename}`);
    
    // Save Image To DataBase
    req.body.image = filename;
    next();
});


// @desc     Get List Of Brands
// @route    GET   /api/v1/brands
// @access   Public
exports.getBrands = handlerFactory.getAllItems(BrandModel);




// @desc     Get Specific Brand By Id
// @route    GET   /api/v1/brands/
// @access   Public
exports.getBrand = handlerFactory.getOneItem(BrandModel);




// @desc     Create Brand
// @route    POST   /api/v1/brands
// @access   Private
exports.createBrand = handlerFactory.createItem(BrandModel);




// @desc     Update Specific Brand By Id
// @route    PUT   /api/v1/brands
// @access   Private
exports.updateBrand = handlerFactory.updateItem(BrandModel);



// @desc     Delete Specific Brand
// @route    DELETE  /api/v1/brands
// @access   Private
exports.deleteBrand = handlerFactory.deleteItem(BrandModel);
