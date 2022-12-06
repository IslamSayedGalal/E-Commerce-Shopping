const express = require('express');

const router = express.Router();

const {
    addProductToWishlistValidator,
    removeProductFromWishlistValidator,
} = require('../utils/validators/wishlistValidators');

const {
    getAllWishlistForLoggedUser,
    addProductToWishlist,
    removeProductFromWishlist,
} = require('../services/wishlistServices');

const {protect, allowedTo } = require('../services/authServices');

router.route('/')
    .get(protect, allowedTo('user'), getAllWishlistForLoggedUser)
    .post(protect, allowedTo('user'), addProductToWishlistValidator, addProductToWishlist);

router.route('/:productId')
    .delete(protect, allowedTo('user'), removeProductFromWishlistValidator, removeProductFromWishlist);

module.exports = router;