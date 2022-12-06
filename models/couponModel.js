const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Coupon Name Required'],
            unique: true,
        },
        expire: {
            type: Date,
            required: [true, 'Coupon Expire Date Required'],
        },
        discount: {
            type: Number,
            required: [true, 'Coupon Discount Value Require'],
        },
    },
    {
        timestamps: true
    }
);

const CouponModel = mongoose.model('Coupon', couponSchema);

module.exports = CouponModel;