const mongoose = require("mongoose");

// 1 - Create Schema
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category Required'],
            unique: [true, 'Category Must Be Unique'],
            minlength: [3, 'Too Short Category Name'],
            maxlength: [32, 'Too Long Category Name'],
        },
        //A and B ==> shopping.com/a-and-b 
        slug:{
            type: String,
            lowercase: true,
        },
        image: String
    },
    {timestamps: true}
);

const setImageURL = (doc) =>{
    if(doc.image){
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};

// findOne, findAll, Update, Delete
categorySchema.post('init', (doc)=>{
    setImageURL(doc);
});

// createOne
categorySchema.post('save', (doc)=>{
    setImageURL(doc);
});


// 2-Create model
const CategoryModel = mongoose.model('Category', categorySchema);


module.exports = CategoryModel;