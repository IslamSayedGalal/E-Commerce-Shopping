const { check} = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleWare');
const ReviewModel = require('../../models/reviewModel');


// @desc    Rules For Validation  createReview
exports.createReviewValidator = [
    check('title')
        .optional(),
    check('ratings')
        .notEmpty()
        .withMessage('Ratings Value Required')
        .isFloat({min: 1, max: 5})
        .withMessage('Ratings Value Must Be Between 1 And 5'),
    
    check('user')
        .isMongoId()
        .withMessage('Invalid Review Id Format'),
    
    check('product')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom((val, { req }) =>
          // Check if logged user create review before
            ReviewModel.findOne({ user: req.user._id, product: req.body.product }).then((review) => {
                console.log(review);
                if (review) {
                    return Promise.reject(new Error('You already created a review before'));
                }
            })
        ),
    
    validatorMiddleware,
];



// @desc    Rules For Validation  getReview
exports.getReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review Id Format'),
    validatorMiddleware,
];



// @desc    Rules For Validation  updateReview
exports.updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom((val, { req }) =>
        // Check review ownership before update
            ReviewModel.findById(val).then((review) => {
                if (!review) {
                    return Promise.reject(new Error(`There is no review with id ${val}`));
                }

                if (review.user._id.toString() !== req.user._id.toString()) {
                    return Promise.reject(new Error(`Your are not allowed to perform this action`));
                }
            })
        ),
    validatorMiddleware,
];


// @desc    Rules For Validation  deleteReview
exports.deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review Id Format')
        .custom((val, { req })=>{
            // check review ownership before update
            if(req.user.role === 'user'){
                return ReviewModel.findById(val).then((review)=>{
                    if(!review){
                        return Promise.reject(new Error(`There is no review with id ${val}`));
                    }

                    if (review.user._id.toString() !== req.user._id.toString()) {
                        return Promise.reject(new Error(`You are not allowed to perform this action`));
                    }
                });
            } 
            return true;
        }),
    validatorMiddleware,
];