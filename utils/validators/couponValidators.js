const {check} = require('express-validator');

const validatorMiddleWare = require('../../middleware/validatorMiddleWare');
const couponModel = require('../../models/couponModel');


// @desc     Rules For Validation Get Specific Coupon
exports.getCouponValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Coupon Id Format'),
    validatorMiddleWare,
];



// @desc     Rules For Validation Create Coupon
exports.createCouponValidator = [
    check('name')
        .notEmpty()
        .withMessage('Coupon Name Required')
        .custom((val) =>
            couponModel.findOne({ name: val }).then((coupon) => {
                if (coupon) {
                    return Promise.reject(new Error('This Coupon already Exist'));
                }
            })
        ),

    check('expire')
        .notEmpty()
        .withMessage('Coupon Expire Is Required'),

    
    check('discount')
        .isNumeric()
        .withMessage('Discount Must Be Is Numeric'),


    validatorMiddleWare,
];



// @desc     Rules For Validation Update Specific Coupon
exports.updateCouponValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Coupon Id Format'),
    
    check('discount')
        .isNumeric()
        .withMessage('Discount Must Be Is Numeric'),

    validatorMiddleWare,
];




// @desc     Rules For Validation Delete Specific Coupon
exports.deleteCouponValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Coupon Id Format'),

    validatorMiddleWare,
];
