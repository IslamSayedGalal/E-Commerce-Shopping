const mongoose = require('mongoose');
const productModel = require('./productModel');

const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        ratings: {
            type: Number,
            min: [1, 'Min Rating Value Is 1.0'],
            max: [5, 'Min Rating Value Is 5.0'],
            required: [true, 'Review Rating Required'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review Must Belong To User'],
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Review Must Belong To Product'],
        },
    },
    {
        timestamps: true
    }
);

reviewSchema.pre(/^find/, function(next){
    this.populate({ path: 'user', select: 'name'});
    next();
});


reviewSchema.statics.calcAverageRatingsAndQuantity = async function(productId){
    const result = await this.aggregate([
        // Step 1 : get all reviews in specific product
        {
            $match: {product: productId},
        },

        // step 2 : grouping reviews based on productId and calc avgRatings, ratingsQuantity

        {
            $group: {
                _id: 'product',
                avgRatings: { $avg: '$ratings'},
                ratingsQuantity: { $sum: 1},
            },
        },
    ]);

    // console.log(result);
    if(result.length > 0){
        await productModel.findByIdAndUpdate(
            productId,
            {
                ratingsAverage: result[0].avgRatings,
                ratingsQuantity: result[0].ratingsQuantity,
            });
    }
    else{
        await productModel.findByIdAndUpdate(
            productId,
            {
                ratingsAverage: 0,
                ratingsQuantity: 0,
            });
    }
};


reviewSchema.post('save', async function (){
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});


reviewSchema.post('remove', async function (){
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;