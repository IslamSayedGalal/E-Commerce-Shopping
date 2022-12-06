const express = require('express');

const router = express.Router();

const {
    addAddressToAddresseslistValidator,
    removeAddressFromAddresseslistValidator,
} = require('../utils/validators/addresseslistValidators');

const {
    addAddress,
    removeAddress,
    getLoggedUserAddresses,
} = require('../services/addresseslistService');

const {protect, allowedTo} = require('../services/authServices');


router.route('/')
    .get(protect, allowedTo('user'), getLoggedUserAddresses)
    .post(protect, allowedTo('user'), addAddressToAddresseslistValidator, addAddress);

router.route('/:addressId')
    .delete(protect, allowedTo('user'), removeAddressFromAddresseslistValidator, removeAddress);

module.exports = router;