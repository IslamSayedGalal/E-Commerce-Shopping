const subCategoryModel = require('../models/subCategoryModel');
const handlerFactory = require('./handlerFactory');


// Nested Route
// Get  /api/v1/categories/:categoryId/subCategories
exports.createFilterObj = (req,res,next)=>{
    let filterObject = {};
    if(req.params.categoryId){
        filterObject = {category: req.params.categoryId};
    }
    req.filterObject = filterObject;
    next();
}

// @desc    Get list of subCategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = handlerFactory.getAllItems(subCategoryModel);




// @desc    Get specific subCategory by id
// @route   Get /api/v1/subcategory
// @access  Public
exports.getSubCategory = handlerFactory.getOneItem(subCategoryModel);



// @desc    Create subCategory
// @route   POST   /api/v1/subcategories
// @access  Private
exports.setCategoryIdToBody = (req,res,next)=>{
    if(!req.body.category){
        req.body.category = req.params.categoryId;
    }
    next();
}

exports.createSubCategory = handlerFactory.createItem(subCategoryModel);




// @desc    Update subCategory
// @route   PUT    /api/v1/subcategories
// @access  Private
exports.updateSubCategory = handlerFactory.updateItem(subCategoryModel)





// @desc    Delete  subCategory
// @route   DELETE   /api/v1/subcategories 
// @access  Private
exports.deleteSubCategory = handlerFactory.deleteItem(subCategoryModel)
