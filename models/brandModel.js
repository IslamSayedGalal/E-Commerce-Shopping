const  mongoose = require('mongoose');

// 1- Create Schema

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Brand Required'],
            unique: [true, 'Brand Must Be Unique'],
            minlength: [3, 'Too Short Brand Name'],
            maxLength: [32, 'Too Long Brand Name'],
        },
        slug:{
            type: String,
            lowercase: true,
        },
        image: String,
    },
    {
        timestamps: true
    }
);

const setImageURL = (doc) =>{
    if(doc.image){
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};

// findOne, findAll, Update, Delete
brandSchema.post('init', (doc)=>{
    setImageURL(doc);
});

// createOne
brandSchema.post('save', (doc)=>{
    setImageURL(doc);
});

// 2- Create Model
const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = BrandModel;