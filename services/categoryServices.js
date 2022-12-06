const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const CategoryModel = require("../models/categoryModel");
const handlerFactory = require('./handlerFactory');
const {uploadSingleImage} = require('../middleware/uploadImageMiddleWare');




// @desc    Upload Image
exports.uploadCategoryImage = uploadSingleImage('image');

// @desc    Image Processing
exports.resizeImage = asyncHandler(async (req,res,next)=>{
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    console.log(`category-${uuidv4()}-${Date.now()}.jpeg`);
    if(req.file){
        await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90})
        .toFile(`uploads/categories/${filename}`);

        // Save Image To DataBase
        req.body.image = filename;
    }

    next();
});

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = handlerFactory.getAllItems(CategoryModel);



// @desc    Get specific category by id
// @route   Get /api/v1/category/:id
// @access  Public
exports.getCategory = handlerFactory.getOneItem(CategoryModel);



// @desc    Create Category
// @route   POST   /api/v1/categories
// @access  Private
exports.createCategory =  handlerFactory.createItem(CategoryModel);



// @desc    Update Specific Category
// @route   PUT    /api/v1/categories/:id
// @access  Private
exports.updateCategory = handlerFactory.updateItem(CategoryModel);


// @desc   Delete Specific Category
// @route  DELETE  /api/v1/categories/:id
// @access Private
exports.deleteCategory = handlerFactory.deleteItem(CategoryModel);




















    //---------------------------------------------------------------------

    // try{
    //     const category = await CategoryModel.create({name, slug: slugify(name) });
    //     res.status(201).json({data: category});
    // }
    // catch(err){
    //     res.status(400).send(err);
    // }


    //--------------------------------------------------------------------


    // CategoryModel.create({name, slug: slugify(name) })
    // .then((category)=>{ 
    //     res.status(201).json({data: category})
    // })
    // .catch((err)=>{
    //     res.status(400).send(err);
    // });