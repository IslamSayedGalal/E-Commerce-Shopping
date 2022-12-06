const CouponModel = require('../models/couponModel');
const handlerFactory = require('./handlerFactory');





// @desc     Get List Of Coupons
// @route    GET   /api/v1/coupons
// @access   Private/Admin-Manager
exports.getCoupons = handlerFactory.getAllItems(CouponModel);




// @desc     Get Specific Coupon By Id
// @route    GET   /api/v1/coupons/
// @access   Private/Admin-Manager
exports.getCoupon = handlerFactory.getOneItem(CouponModel);




// @desc     Create Coupon
// @route    POST   /api/v1/coupons
// @access   Private/Admin-Manager
exports.createCoupon = handlerFactory.createItem(CouponModel);




// @desc     Update Specific Coupon By Id
// @route    PUT   /api/v1/coupons
// @access   Private/Admin-Manager
exports.updateCoupon = handlerFactory.updateItem(CouponModel);



// @desc     Delete Specific Coupon
// @route    DELETE  /api/v1/coupons
// @access   Private/Admin-Manager
exports.deleteCoupon = handlerFactory.deleteItem(CouponModel);
