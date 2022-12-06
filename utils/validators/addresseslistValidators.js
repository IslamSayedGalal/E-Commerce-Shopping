const {check} = require('express-validator');
const validatorMiddleWare = require('../../middleware/validatorMiddleWare');

// @desc    Rules For Validation Add Address To Addresseslist
exports.addAddressToAddresseslistValidator = [
    check('phone')
        .isMobilePhone(['ar-EG','ar-SA'])
        .withMessage('Invalid Phone Number Accepted Only EGY And SA Numbers'),
            
    validatorMiddleWare,
];




// @desc    Rules For Validation remove Address From Addresseslist
exports.removeAddressFromAddresseslistValidator = [
    check('addressId')
        .isMongoId()
        .withMessage('Invalid Address Id Format'),
    validatorMiddleWare,
];



