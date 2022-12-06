const slugify = require('slugify');
const {check, body} = require('express-validator');
const validatorMiddleWare = require('../../middleware/validatorMiddleWare');
const Category = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');


// @desc    Rules For Validation  createProduct
exports.createProductValidator = [
    check('title')
        .isLength({ min: 3})
        .withMessage('Must Be At Least 3 Characters')
        .notEmpty()
        .withMessage('Product Title Required')
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),

    check('description')
        .notEmpty()
        .withMessage('Product Description Is Required')
        .isLength({ max: 2000})
        .withMessage('Too Long Description'),
    
    check('quantity')
        .notEmpty()
        .withMessage('Product Quantity Is Required')
        .isNumeric()
        .withMessage('Product Quantity Must Be A Number'),
    
    check('sold')
        .optional()
        .isNumeric()
        .withMessage('Product Quantity Must Be A Number'),
    
    check('price')
        .notEmpty()
        .withMessage('Product Price Is Required')
        .isNumeric()
        .withMessage('Product Price Must Be A Number')
        .isLength({ max: 32})
        .withMessage('Too Long Price String'),
    
    check('priceAfterDiscount')
        .optional()
        .isNumeric()
        .withMessage('Product Price After Discount Must Be A Number')
        .toFloat()
        .custom((value, {req})=>{
            if(req.body.price <= value){
                throw new Error('Price After Discount Must Be Lower Than Price');
            }
            return true;
        }),
    
    check('colors')
        .optional()
        .isArray()
        .withMessage('Available Colors Must Be Array Of String'),
    
    check('imageCover')
        .notEmpty()
        .withMessage('Product Image Cover Is Required'),
    
    check('images')
        .optional()
        .isArray()
        .withMessage('Image Must Be Array Of String'),
    
    check('category')
        .notEmpty()
        .withMessage('Product Must Be Belong To A Category')
        .isMongoId()
        .withMessage('Invalid Id Formate')
        .custom((categoryId) =>
            Category.findById(categoryId).then((category) => {
                if (!category) {
                return Promise.reject(
                    new Error(`No category for this id: ${categoryId}`)
                );
                }
            })
        ),

    check('subcategories')
        .optional()
        .isMongoId()
        .withMessage('Invalid Id Formate')
        .custom((subcategoryIds)=>{
            SubCategory.find({_id: {$exists: true, $in: subcategoryIds}})
                .then((result)=>{
                    if(result.length < 1 || result.length !== subcategoryIds.length){
                        return Promise.reject(new Error('Invalid Sub Categories Id'))
                    }
                })
        })

        .custom((val, {req})=>{
            SubCategory.find({category: req.body.category})
                .then((subcategories)=>{
                    const subCategoriesIdsInDB = [];
                    subcategories.forEach((subCategory)=>{
                        subCategoriesIdsInDB.push(subCategory._id.toString());
                    });
                    // check if subcategories ids in db include subcategories in req.body (true)
                    const checker = (target, arr)=> target.every((v)=> arr.includes(v));
                    if(!checker(val, subCategoriesIdsInDB)){
                        return Promise.reject(
                            new Error(`Sub Categories Not Belong To Category`)
                        )
                    }
                })
        }),

    check('brand')
        .optional()
        .isMongoId()
        .withMessage('Invalid Id Formate'),
    
    check('ratingsAverage')
        .optional()
        .isNumeric()
        .withMessage('ratingsAverage must be a number')
        .isLength({ min: 1 })
        .withMessage('Rating must be above or equal 1.0')
        .isLength({ max: 5 })
        .withMessage('Rating must be below or equal 5.0'),
    
    check('ratingsQuantity')
        .optional()
        .isNumeric()
        .withMessage('Rating Quantity Must Be A Number'),
    
    validatorMiddleWare,
];


// @desc    Rules For Validation getProduct
exports.getProductValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Id Formate'),
    validatorMiddleWare,
];


// @desc    Rules For Validation updateProduct
exports.updateProductValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Id Formate'),
    
    body('title')
        .optional()
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleWare,
];


// @desc    Rules For Validation deleteProduct
exports.deleteProductValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Id Formate'),
    validatorMiddleWare,
];