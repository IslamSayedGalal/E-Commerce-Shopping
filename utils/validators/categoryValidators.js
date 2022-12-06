const {check, body} = require('express-validator');
const { default: slugify } = require('slugify');
const validatorMiddleWare = require('../../middleware/validatorMiddleWare');


// @desc    Rules For Validation getCategory
exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category Id Format'),
    validatorMiddleWare,
];


// @desc    Rules For Validation createCategory
exports.createCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('Category Name Required')
        .isLength({min: 3})
        .withMessage('Too Short Category Name')
        .isLength({max: 32})
        .withMessage('Too Long Category Name'),
    body('name')
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleWare,
];



// @desc    Rules For Validation updateCategory
exports.updateCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Category Id Format'),
    body('name')
        .optional()
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleWare,
];



// @desc    Rules For Validation deleteCategory
exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category Id Format'),
    validatorMiddleWare,
];