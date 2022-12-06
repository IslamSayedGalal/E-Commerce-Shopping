const mongoose = require("mongoose");


// 1 - Create Schema
const subCategorySchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim: true,
            unique: [true, 'SubCategory Must Be Unique'],
            minlength: [2, 'Too Short SubCategory Name'],
            maxlength: [32, 'Too Long SubCategory Name'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'SubCategory Must Be Belong To Parent Category'],
        },
    },
    {
        timestamps: true
    }
);

// 2-Create model
const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategoryModel;