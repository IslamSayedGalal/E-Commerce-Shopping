const express = require('express');

const router = express.Router();

const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../utils/validators/productValidators');


const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    resizeProductImage,
} = require('../services/productServices');

const reviewsRoute = require('./reviewRoutes');

const {protect, allowedTo } = require('../services/authServices');

// @desc     POST   products/productId/reviews     
// @desc     GET   products/productId/reviews     
// @desc     GET   products/productId/reviews/reviewId     
router.use('/:productId/reviews', reviewsRoute);

router.route('/')
    .get(getProducts)
    .post(protect, allowedTo('admin', 'manager'), uploadProductImage, resizeProductImage, createProductValidator, createProduct);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(protect, allowedTo('admin', 'manager'), uploadProductImage, resizeProductImage, updateProductValidator, updateProduct)
    .delete(protect, allowedTo('admin'), deleteProductValidator, deleteProduct);

module.exports = router;