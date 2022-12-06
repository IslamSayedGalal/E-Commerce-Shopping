const {check, body} = require('express-validator');
const { default: slugify } = require('slugify');
const validatorMiddleWare = require('../../middleware/validatorMiddleWare');




// @desc     Rules For Validation getBrand
exports.getBrandValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Brand Id Format'),
    validatorMiddleWare,
];




// @desc     Rules For Validation createBrand
exports.createBrandValidator = [
    check('name')
        .notEmpty()
        .withMessage('Brand Name Required')
        .isLength({min: 3})
        .withMessage('Too Short Brand Name')
        .isLength({max: 32})
        .withMessage('Too Long Brand Name'),
    body('name')
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleWare,
];




// @desc     Rules For Validation updateBrand
exports.updateBrandValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Brand Id Format'),
    body('name')
        .optional()
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleWare,
];




// @desc     Rules For Validation deleteBrand
exports.deleteBrandValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Brand Id Format'),
    validatorMiddleWare,
];
