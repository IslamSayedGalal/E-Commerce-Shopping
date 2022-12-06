const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const asyncHandler = require('express-async-handler');
const {uploadMixOfImages} = require('../middleware/uploadImageMiddleWare');
const ProductModel = require('../models/productModel');
const handlerFactory = require('./handlerFactory');



// @desc    Upload Image
exports.uploadProductImage = uploadMixOfImages([
    {
        name: 'imageCover',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    },
]);


// @desc    Image Processing
exports.resizeProductImage =asyncHandler(async(req, res, next)=>{
    // console.log(req.files);
    
    //1- Image Processing For ImageCover
    if(req.files.imageCover){
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({quality: 95})
            .toFile(`uploads/products/${imageCoverFileName}`);
        
        // Save Image Into Our DB
        req.body.imageCover = imageCoverFileName;
    }

    //2- Image Processing For Images Array
    if(req.files.images){
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async(img, index)=>{
                const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({quality: 95})
                    .toFile(`uploads/products/${imageName}`);
                
                // Save Image Into Our DB
                req.body.images.push(imageName);
            })
        );
        next();
    }
});

// @desc     Get List Of Products
// @route    GET  /api/v1/products
// @access   Public
exports.getProducts = handlerFactory.getAllItems(ProductModel, "Products");



// @desc     Get Specific Product By Id
// @route    GET  /api/v1/products/:id
// @access   Public
exports.getProduct = handlerFactory.getOneItem(ProductModel, 'reviews');




// @desc     Create Product
// @route    POSt  /api/v1/products
// @access   Private
exports.createProduct = handlerFactory.createItem(ProductModel);



// @desc     Update Specific Product
// @route    PUT   /api/v1/Products/:id
// @access   Private
exports.updateProduct = handlerFactory.updateItem(ProductModel);




// @desc     Delete Specific Product
// @route    DELETE  /api/v1/products/:id
// @access   Private
exports.deleteProduct = handlerFactory.deleteItem(ProductModel);
