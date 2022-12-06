const express = require('express');

const router = express.Router();

const {
    getCouponValidator,
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator
} = require('../utils/validators/couponValidators');

const {
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} = require('../services/couponServices');

const {protect, allowedTo } = require('../services/authServices');

router.use(protect, allowedTo('admin', 'manager'))

router.route('/')
    .get(getCoupons)
    .post(createCouponValidator, createCoupon);
router.route('/:id')
    .get(getCouponValidator, getCoupon)
    .put(updateCouponValidator, updateCoupon)
    .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;