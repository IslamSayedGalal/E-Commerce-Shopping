const express = require('express');

const router = express.Router();

const { signupValidator, loginValidator } = require('../utils/validators/authValidators');

const { singup, login, forgetPassword, verifyPasswordResetCode, resetCode } = require('../services/authServices');



router.route('/signup').post(signupValidator, singup);
router.route('/login').post(loginValidator, login);
router.route('/forgetPassword').post(forgetPassword);
router.route('/verifyResetCode').post(verifyPasswordResetCode);
router.route('/resetPassword').put(resetCode);


module.exports =router;