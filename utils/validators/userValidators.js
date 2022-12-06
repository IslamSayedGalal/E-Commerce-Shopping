const {check, body} = require('express-validator');
const { default: slugify } = require('slugify');
const bcrypt = require('bcrypt');

const validatorMiddleWare = require('../../middleware/validatorMiddleWare');
const userModel = require('../../models/userModel');


// @desc     Rules For Validation getUser
exports.getUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User Id Format'),
    validatorMiddleWare,
];




// @desc     Rules For Validation createUser
exports.createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('User Name Required')
        .isLength({min: 3})
        .withMessage('Too Short User Name')
        .isLength({max: 32})
        .withMessage('Too Long User Name'),
    body('name')
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),

    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
        userModel.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error('E-mail already Exist'));
            }
        })
    ),

    check('password')
        .notEmpty()
        .withMessage('Password Required')
        .isLength({min: 6})
        .withMessage('Password Must Be At Least 6 Characters')
        .custom((password, {req})=>{
            if(password !== req.body.passwordConfirm){
                throw new Error('Password Confirmation Incorrect');
            }
            return true;
        }),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password Confirmation Required'),

    check('phone')
        .optional()
        .isMobilePhone(['ar-EG','ar-SA'])
        .withMessage('Invalid Phone Number Accepted Only EGY And SA Numbers'),

    check('profileImage')
        .optional(),

    check('role')
        .optional(),

    validatorMiddleWare,
];




// @desc     Rules For Validation updateUser
exports.updateUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User Id Format'),
    body('name')
        .optional()
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),
    
    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
        userModel.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error('E-mail already Exist'));
            }
        })
    ),

    check('phone')
        .optional()
        .isMobilePhone(['ar-EG','ar-SA'])
        .withMessage('Invalid Phone Number Accepted Only EGY And SA Numbers'),

    check('profileImage')
        .optional(),

    check('role')
        .optional(),

    validatorMiddleWare,
];


// @desc     Rules For Validation updateUserPassword
exports.updateUserPasswordValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User Id Format'),
    
    body('currentPassword')
        .notEmpty()
        .withMessage('You Must Enter Your Current Password'),

    body('passwordConfirm')
        .notEmpty()
        .withMessage('You Must Enter The Password Confirm'),
    
    body('password')
        .notEmpty()
        .withMessage('You Must Enter New Password')
        .custom(async (val, {req})=>{
            // 1) Verify Current Password
            const user = await userModel.findById(req.params.id);

            if(!user){
                throw new Error('There Is No User For This Is');
            }

            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );

            if(!isCorrectPassword){
                throw new Error('Incorrect Current Password');
            }

            // 2) Verify New Password Is Equal Confirm Password Or Not
            if(val !== req.body.passwordConfirm){
                throw new Error('Password Confirm Incorrect');
            }
            return true;
        }),

    validatorMiddleWare,
];


// @desc     Rules For Validation deleteUser
exports.deleteUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User Id Format'),
    validatorMiddleWare,
];



// @desc     Rules For Validation updateLoggedUserData
exports.updateLoggedUserDataValidator = [
    body('name')
        .optional()
        .custom((val, {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),

    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom((val) =>
            userModel.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error('E-mail already Exist'));
                }
            })
        ),

    check('phone')
        .optional()
        .isMobilePhone(['ar-EG','ar-SA'])
        .withMessage('Invalid Phone Number Accepted Only EGY And SA Numbers'),
    
    validatorMiddleWare,
]