const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');


// @desc     Get List Of Items
// @route    GET   /api/v1/....
// @access   Public
exports.getAllItems =(Model, modelName='')=> asyncHandler(async (req,res)=>{
    //Filter Object 
    let filter = {};
    if (req.filterObject) {
        filter = req.filterObject;
    }

    //  Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeature = new ApiFeatures(Model.find(filter),req.query)
        .paginate(documentsCounts)
        .filter()
        .search(modelName)
        .selectFields()
        .sort();

    //Execute Query
    const { mongooseQuery, paginationResult} = apiFeature;
    const document = await mongooseQuery;

    res.status(200).json({results: document.length, paginationResult, data: document});
});




// @desc     Get Specific Item By Id
// @route    GET   /api/v1/......
// @access   Public
exports.getOneItem = (Model, populationOpt)=> asyncHandler( async (req, res, next)=>{
    
    // 1) Build Query
    let query = Model.findById(req.params.id);
    if(populationOpt){
        query = query.populate(populationOpt);
    }

    // 2) Execute Query
    const document = await query;
    
    if(!document){
        // res.status(404).json({msg: `Not Found Any Brand For This Id ${id}`});
        return next(new ApiError(`Not Found Any Result For This Id ${req.params.id}`, 404));
    }
    res.status(200).json({data: document});
});




// @desc    Create Item
// @route   POST   /api/v1/...
// @access  Private
exports.createItem = (Model)=> asyncHandler( async (req,res)=>{
    const document = await Model.create(req.body);
    // console.log(document);
    res.status(201).json({data: document});
});





// @desc    Update AnyThing
// @route   PUT    /api/v1/.....
// @access  Private
exports.updateItem = (Model)=> asyncHandler( async (req, res, next)=>{
    const document = await Model.findByIdAndUpdate( req.params.id, req.body,
        {new: true}
    );

    if(!document){
        // res.status(404).json({msg: `Not Found Any Brand For This Id ${id}`});
        return next(new ApiError(`Not Found Any Result For This Id ${req.params.id}`, 404));
    }

    // Trigger 'save' event when update document
    document.save();
    res.status(200).json({data: document});
});



// @desc    Delete AnyThing
// @route   DELETE    /api/v1/.....
// @access  Private
exports.deleteItem = (Model)=> asyncHandler(async (req,res,next)=>{
    const document = await Model.findByIdAndDelete(req.params.id);

    if(!document){
        // res.status(404).json({msg: `Not Found Any Category For This Id ${id}`});
        return next(new ApiError(`Not Found Any Result For This Id ${req.params.id}`, 404));
    }


    // Trigger 'remove' event when delete document
    document.remove();
    res.status(204).json({data: document});
});


