const express = require("express");
const subCategoriesRoute = require('./subCategoryRoutes');

const router = express.Router();

const { 
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../utils/validators/categoryValidators');

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    resizeImage,
} = require("../services/categoryServices");


const {protect, allowedTo } = require('../services/authServices');


router.use('/:categoryId/subcategories', subCategoriesRoute);

// router.get('/',getCategories);
// router.post('/',createCategory);

//OR 
router.route('/')
    .get(getCategories)
    .post(protect, allowedTo('admin', 'manager'), uploadCategoryImage, resizeImage, createCategoryValidator, createCategory);
router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(protect, allowedTo('admin', 'manager'), uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
    .delete(protect, allowedTo('admin'), deleteCategoryValidator, deleteCategory);

module.exports = router;