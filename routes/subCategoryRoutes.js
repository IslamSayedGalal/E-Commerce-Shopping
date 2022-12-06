const express = require("express");

// mergeParams Allow Us To Access Parameters ON Other Routers
// ex: We Need To Access CategoryId From Category Router 
const router = express.Router({mergeParams: true});

const  {
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require('../utils/validators/subCategoryValidators');

const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObj,
} = require('../services/subCategoryServices');

const {protect, allowedTo } = require('../services/authServices');

router.route('/')
    .get(createFilterObj, getSubCategories)
    .post(protect, allowedTo('admin', 'manager'), setCategoryIdToBody, createSubCategoryValidator, createSubCategory);


router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(protect, allowedTo('admin', 'manager'), updateSubCategoryValidator, updateSubCategory)
    .delete(protect, allowedTo('admin'), deleteSubCategoryValidator, deleteSubCategory)


module.exports = router;