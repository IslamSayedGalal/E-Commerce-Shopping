const ReviewModel = require('../models/reviewModel');
const handlerFactory = require('./handlerFactory');


// Nested Route Get All Reviews on Specific Product
// Get  /api/v1/products/:productId/reviews
exports.createFilterObj = (req,res,next)=>{
    let filterObject = {};
    if(req.params.productId){
        filterObject = {product: req.params.productId};
    }
    req.filterObject = filterObject;
    next();
}

// @desc     Get List Of Reviews
// @route    GET   /api/v1/reviews/
// @access   Public
exports.getReviews = handlerFactory.getAllItems(ReviewModel);




// @desc     Get Specific Review By Id
// @route    GET   /api/v1/reviews/
// @access   Public
exports.getReview = handlerFactory.getOneItem(ReviewModel);



// @desc     Create Review
// @route    POST   /api/v1/reviews/
// @access   Private/Protect/User
exports.setProductIdAndUserIdToBody = (req,res,next)=>{
    if(!req.body.product){
        req.body.product = req.params.productId;
    }
    if(!req.body.user){
        req.body.user = req.user._id;
    }
    next();
}

exports.createReview = handlerFactory.createItem(ReviewModel);




// @desc     Update Specific Review By Id
// @route    PUT   /api/v1/reviews/
// @access   Private/Protect/User
exports.updateReview = handlerFactory.updateItem(ReviewModel);



// @desc     Delete Specific Review
// @route    DELETE  /api/v1/reviews/
// @access   PrivateProtect/User-Admin-Manager
exports.deleteReview = handlerFactory.deleteItem(ReviewModel);
