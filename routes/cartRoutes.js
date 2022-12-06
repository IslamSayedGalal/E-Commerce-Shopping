const express = require("express");

const router = express.Router();


const {
    addProductToCart,
    getCartItemsForLoggedUser,
    updateSpecificItemFromCart,
    removeSpecificItemFromCart,
    clearCartForLoggedUser,
    applyCoupon,
} = require("../services/cartServices");

const { protect, allowedTo } = require("../services/authServices");

router.use(protect, allowedTo("user"))

router.route("/")
    .get(getCartItemsForLoggedUser)
    .post(addProductToCart)
    .delete(clearCartForLoggedUser);

router.route('/applyCoupon').put(applyCoupon);

router.route("/:itemId")
    .put(updateSpecificItemFromCart)
    .delete(removeSpecificItemFromCart);


module.exports = router;
