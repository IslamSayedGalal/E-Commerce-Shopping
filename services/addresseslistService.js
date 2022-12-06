const asyncHandler = require('express-async-handler');

const userModel = require('../models/userModel');

// @desc    Add Address To AddressesList
// @route   POST /api/v1/addresses
// @access  Protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
    // $addToSet => add address object to user addresses  array if address not exist
    const userAddressesList = await userModel.findByIdAndUpdate(
    req.user._id,
    {
        $addToSet: { addressesList: req.body },
    },
    { 
        new: true 
    });

    res.status(200).json({status: 'success', message: 'Address added successfully.', data: userAddressesList.addressesList,});
});




// @desc    Remove Address From Addresses List
// @route   DELETE /api/v1/addresses/:addressId
// @access  Protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
    // $pull => remove address object from user addresses array if addressId exist
    const userAddressesList = await userModel.findByIdAndUpdate(
    req.user._id,
    {
        $pull: { addressesList: { _id: req.params.addressId } },
    },
    { 
        new: true 
    });

    res.status(200).json({status: 'success', message: 'Address removed successfully.', data: userAddressesList.addressesList});
});



// @desc    Get All Addresseslist For Logged User
// @route   GET /api/v1/addresses
// @access  Protected/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const userAddressesList = await userModel.findById(req.user._id).populate('addressesList');

    res.status(200).json({ status: 'success', results: userAddressesList.addressesList.length, data: userAddressesList.addressesList});
});