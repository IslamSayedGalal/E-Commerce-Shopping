const asyncHandler = require('express-async-handler');

const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');
const couponModel = require('../models/couponModel');
const ApiError = require('../utils/apiError');



const calcTotalCartPrice = (cart) =>{
    let totalPrice = 0;
    cart.cartItems.forEach((item)=>{
        totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
}

// @desc     Add Product To Cart
// @route    GET   /api/v1/cart/
// @access   Private/User
exports.addProductToCart = asyncHandler(async (req, res, next)=>{
    const {productId, color } = req.body;
    let quantityCount = req.body.quantity;

    if(!Number.isInteger(quantityCount)){
        quantityCount = 1;
    }
    // console.log(quantityCount);
    const product = await productModel.findById(productId);

    // 1) Get Cart For Logged User
    let cart = await cartModel.findOne({user: req.user._id});
    
    if(!cart){
        // Create Cart For Logged User With Product
        cart = await cartModel.create({
            user: req.user._id,
            cartItems: [{product: productId, quantity: quantityCount, color, price: product.price}],
        });
    }
    else{
        // Product Exist In Cart, Update Product Quantity
        const productIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId && item.color === color
        );

        if(productIndex> -1){
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += quantityCount;
            cart.cartItems[productIndex] = cartItem;
        }
        else{
            cart.cartItems.push({product: productId, quantity: quantityCount, color, price: product.price});
        }
    }

    // Calculate total cart price
    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({status: 'Success', message: 'Product Added To Cart Successfully', numOfCartItems: cart.cartItems.length, data: cart});


});



// @desc     Get All Products From Cart For Logged User
// @route    GET   /api/v1/cart/
// @access   Private/User
exports.getCartItemsForLoggedUser = asyncHandler(async(req, res, next)=>{
    const cart = await cartModel.findOne({user: req.user._id});

    if(!cart){
        return next(new ApiError(`There Is No Cart For This User Id ${req.user._id}`, 404));
    }

    res.status(200).json({status: 'Success', numOfCartItems: cart.cartItems.length, data: cart});
});




// @desc     Remove Specific Item From Cart For Logged User
// @route    GET   /api/v1/cart/
// @access   Private/User
exports.removeSpecificItemFromCart = asyncHandler(async(req,res,next)=> {
    const cart = await cartModel.findOneAndUpdate(
        {
            user: req.user._id,
        },
        {
            $pull: { cartItems: { _id: req.params.itemId } },
        },
        {
            new: true,
        }
    );

    // Calculate total cart price
    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({status: 'Success', message: 'Product Removed From Cart Successfully', numOfCartItems: cart.cartItems.length, data: cart});

});






// @desc     Remove All Item From Cart For Logged User
// @route    GET   /api/v1/cart/
// @access   Private/User
exports.clearCartForLoggedUser = asyncHandler(async(req,res,next)=>{
    await cartModel.findOneAndDelete({user: req.user._id});
    res.status(204).send();
});





// @desc     Update Specific Item From Cart For Logged User
// @route    GET   /api/v1/cart/
// @access   Private/User
exports.updateSpecificItemFromCart = asyncHandler(async (req, res, next)=>{
    const { quantity } = req.body;

    const cart = await cartModel.findOne({ user: req.user._id});
    if(!cart){
        return next(new ApiError(`There Is No Cart For User ${req.user._id}`));
    }


    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId
    );

    if(itemIndex > -1){
        const cartItem = cart.cartItems[itemIndex];
        cartItem.quantity = quantity;
        cart.cartItems[itemIndex] = cartItem;
    }
    else{
        return next(new ApiError(`There Is No Item For This Id : ${req.params.itemId}`));
    }

    calcTotalCartPrice(cart);

    res.status(200).json({status: 'Success', numOfCartItems: cart.cartItems.length, data: cart});
});




// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    // 1) Get coupon based on coupon name
    const coupon = await couponModel.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() },
    });

    if (!coupon) {
        return next(new ApiError(`Coupon is invalid or expired`));
    }

    // 2) Get logged user cart to get total cart price
    const cart = await cartModel.findOne({ user: req.user._id });

    const totalPrice = cart.totalCartPrice;

    // 3) Calculate price after priceAfterDiscount
    const totalPriceAfterDiscount = (
        totalPrice -
      (totalPrice * coupon.discount) / 100
    ).toFixed(2); // 99.23

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});