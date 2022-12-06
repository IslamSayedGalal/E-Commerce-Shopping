const asyncHandler = require('express-async-handler');

const userModel = require('../models/userModel');


// @desc     Add Product To Wishlist
// @route    POST  /api/v1/wishlist/
// @access   Protected/User
exports.addProductToWishlist = asyncHandler(async (req, res, next)=>{
    // $addToSet => Add ProductId To Wishlist Array
    const userWishlist = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {wishlist: req.body.productId},
        },
        {
            new: true
        }
    );

    res.status(200).json({status: 'Success', message: 'Product Added Successfully To Your Wishlist.', data: userWishlist.wishlist});
});



// @desc     Remove Product From Wishlist
// @route    POST  /api/v1/wishlist/:productId
// @access   Protected/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next)=>{
    // $pull => Remove ProductId From Wishlist Array
    const userWishlist = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {wishlist: req.params.productId},
        },
        {
            new: true
        }
    );

    res.status(200).json({status: 'Success', message: 'Product Removed Successfully From Your Wishlist.', data: userWishlist.wishlist});
});



// @desc     Get Wishlist For Logged User
// @route    POST  /api/v1/wishlist/
// @access   Protected/User
exports.getAllWishlistForLoggedUser = asyncHandler(async (req, res, next)=>{
    // $pull => Remove ProductId From Wishlist Array
    const userWishlist = await userModel.findById(req.user._id).populate('wishlist');

    res.status(200).json({status: 'Success', result: userWishlist.wishlist.length, data: userWishlist.wishlist});
});