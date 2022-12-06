const express = require('express');

const router = express.Router();

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    updateUserPasswordValidator,
    deleteUserValidator,
    updateLoggedUserDataValidator,
} = require('../utils/validators/userValidators');

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    updateUserPassword,
    deleteUser,
    uploadUserImage,
    resizeImage,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData
} = require('../services/userServices');

const {protect, allowedTo } = require('../services/authServices');

router.get('/getMe',protect, getLoggedUserData, getUser )
router.put('/changeMyPassword',protect, updateLoggedUserPassword);
router.put('/updateMe',protect, updateLoggedUserDataValidator, updateLoggedUserData);
router.delete('/deleteMe', protect, deleteLoggedUserData);


router.put('/changePassword/:id', updateUserPasswordValidator, updateUserPassword);
router.route('/')
    .get(protect, allowedTo('admin', 'manager'), getUsers)
    .post(protect, allowedTo('admin'), uploadUserImage, resizeImage,createUserValidator, createUser);

router.route('/:id')
    .get(protect, allowedTo('admin'), getUserValidator, getUser)
    .put(protect, allowedTo('admin'), uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(protect, allowedTo('admin'), deleteUserValidator, deleteUser);

module.exports = router;