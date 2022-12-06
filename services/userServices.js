const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt')

const ApiError = require('../utils/apiError');
const UserModel = require('../models/userModel');
const handlerFactory = require('./handlerFactory');
const createToken = require('../utils/createToken');
const {uploadSingleImage} = require('../middleware/uploadImageMiddleWare');


// @desc    Upload Image
exports.uploadUserImage = uploadSingleImage('profileImage');


// @desc    Image Processing
exports.resizeImage = asyncHandler(async (req,res,next)=>{
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    // console.log(`user-${uuidv4()}-${Date.now()}.jpeg`);
    if(req.file){
        await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90})
        .toFile(`uploads/users/${filename}`);

        // Save Image To DataBase
        req.body.image = filename;
    }

    next();
});


// @desc     Get List Of Users
// @route    GET   /api/v1/users
// @access   Private
exports.getUsers = handlerFactory.getAllItems(UserModel);




// @desc     Get Specific User By Id
// @route    GET   /api/v1/users/
// @access   Private
exports.getUser = handlerFactory.getOneItem(UserModel);




// @desc     Create User
// @route    POST   /api/v1/users
// @access   Private
exports.createUser = handlerFactory.createItem(UserModel);




// @desc     Update Specific User By Id
// @route    PUT   /api/v1/users
// @access   Private
exports.updateUser =  asyncHandler( async (req, res, next)=>{
    const document = await UserModel.findByIdAndUpdate( 
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            phone: req.body.phone,
            email: req.body.email,
            profileImage: req.body.profileImage,
            role: req.body.role,
        },
        {
            new: true
        }
    );

    if(!document){
        // res.status(404).json({msg: `Not Found Any Brand For This Id ${id}`});
        return next(new ApiError(`Not Found Any Result For This Id ${req.params.id}`, 404));
    }
    res.status(200).json({data: document});
});



// @desc     Update Specific User Password By Id
// @route    PUT   /api/v1/users
// @access   Private
exports.updateUserPassword = asyncHandler( async (req, res, next)=>{
    const document = await UserModel.findByIdAndUpdate( 
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true
        }
    );

    if(!document){
        // res.status(404).json({msg: `Not Found Any Brand For This Id ${id}`});
        return next(new ApiError(`Not Found Any Result For This Id ${req.params.id}`, 404));
    }
    res.status(200).json({data: document});
});



// @desc     Delete Specific User
// @route    DELETE  /api/v1/users
// @access   Private
exports.deleteUser = handlerFactory.deleteItem(UserModel);



// @desc     Get Logged User Data
// @route    DELETE  /api/v1/getMe
// @access   Private
exports.getLoggedUserData = asyncHandler(async (req, res, next)=>{
    req.params.id = req.user._id;
    next();
});



// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Update user password based user payload (req.user._id)
    const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
    },
    {
        new: true,
    }
    );

    // 2) Generate token
    const token = createToken(user._id);
    res.status(200).json({ data: user, token });
});



// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    },
    { new: true }
    );

    res.status(200).json({ data: updatedUser });
});



// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await UserModel.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({ status: 'Success' });
});