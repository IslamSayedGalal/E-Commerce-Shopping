const express = require("express");

const router = express.Router();

const {
    createCashOrder,
    getAllOrders,
    getSpecificOrder,
    filterOrderForLoggedUser,
    updateOrderToPaid,
    updateOrderToDelivered,
    checkoutSession,
} = require("../services/orderServices");

const { protect, allowedTo } = require("../services/authServices");


router.route('/checkout-session/:cartId').get(protect, allowedTo('user'), checkoutSession);

router.route('/:cartId').post(protect, allowedTo('user'), createCashOrder)

router.route('/').get(protect, allowedTo('user', 'admin', 'manager'), filterOrderForLoggedUser, getAllOrders);

router.route('/:id').get(getSpecificOrder);

router.route('/:id/pay').put(protect, allowedTo('admin', 'manager'), updateOrderToPaid);

router.route('/:id/deliver').put(protect, allowedTo('admin', 'manager'), updateOrderToDelivered);

module.exports = router;