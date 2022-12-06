const {check,body } = require('express-validator');
const { default: slugify } = require('slugify');
const validatorMiddleWare = require('../../middleware/validatorMiddleWare');

// @desc    Rules For Validation getSubCategory
exports.getSubCategoryValidator = [
    check('id')
        .notEmpty()
        .withMessage('subCategory Id Must Be Belong To SubCategory Not Empty')
        .isMongoId()
        .withMessage('Invalid SubCategory Id Format'),
    validatorMiddleWare,
];



// @desc    Rules For Validation createSubCategory
exports.createSubCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('SubCategory Name Required')
        .isLength({min: 2})
        .withMessage('Too Short SubCategory Name')
        .isLength({max: 32})
        .withMessage('Too Long SubCategory Name'),

    check('category')
        .notEmpty()
        .withMessage('subCategory Must Be Belong To Category')
        .isMongoId()
        .withMessage('Invalid Category Id Format'),
        body('name'),
    
    body('name')
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),
        
    validatorMiddleWare,
];



// @desc    Rules For Validation updateSubCategory
exports.updateSubCategoryValidator = [
    check('id')
        .notEmpty()
        .withMessage('subCategory Id Must Be Belong To SubCategory Not Empty')
        .isMongoId()
        .withMessage('Invalid SubCategory Id Format'),
    body('name')
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleWare,
];



// @desc    Rules For Validation deleteSubCategory
exports.deleteSubCategoryValidator = [
    check('id')
        .notEmpty()
        .withMessage('subCategory Id Must Be Belong To SubCategory Not Empty')
        .isMongoId()
        .withMessage('Invalid SubCategory Id Format'),
    validatorMiddleWare,
];
