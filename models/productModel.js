const mongoose = require('mongoose');


const productSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required: [true, 'Product Title Is Required'],
            trim: true,
            minlength: [3, 'Too Short Product Title'],
            maxlength: [100, 'Too Long Product Title'],
        },
        slug:{
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Product Description Is Required'],
            minlength: [20, 'Too Short Product Description'],
        },
        quantity: {
            type: Number,
            required: [true, 'Product Quantity Is Required'],
        },
        sold: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Product Price Is Required'],
            trim: true,
            max: [20000, 'Too Long Product Price'],
        },
        priceAfterDiscount:{
            type: Number,
        },
        colors: [String],
        imageCover: {
            type: String,
            required: [true, 'Product Image Cover Is Required'],
        },
        images: [String],

        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'Product Must Be Belong To Category'],
        },
        subcategories: [
            {
            type: mongoose.Schema.ObjectId,
            ref: 'SubCategory',
            }
        ],
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: 'Brand',
        },
        ratingsAverage: {
            type: Number,
            min: [1, 'Rating Must Be Above Or Equal 1.0'],
            max: [5, 'Rating Must Be Below Or Equal 5.0'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
                // to enable virtual populate
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);


productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
});


// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: 'name -_id',
    });
    next();
});


const setImageURL = (doc) =>{
    if(doc.imageCover){
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
    if(doc.images){
        const imagesList = [];
        doc.images.forEach((image)=>{
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            imagesList.push(imageUrl);
        });
        doc.images = imagesList;
    }
};

// findOne, findAll, Update, Delete
productSchema.post('init', (doc)=>{
    setImageURL(doc);
});

// createOne
productSchema.post('save', (doc)=>{
    setImageURL(doc);
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;