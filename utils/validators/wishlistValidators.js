const {check} = require('express-validator');
const validatorMiddleWare = require('../../middleware/validatorMiddleWare');

// @desc    Rules For Validation Add Product To Wishlist
exports.addProductToWishlistValidator = [
    check('productId')
        .isMongoId()
        .withMessage('Invalid Product Id Format'),
    validatorMiddleWare,
];




// @desc    Rules For Validation remove Product From Wishlist
exports.removeProductFromWishlistValidator = [
    check('productId')
        .isMongoId()
        .withMessage('Invalid Product Id Format'),
    validatorMiddleWare,
];



