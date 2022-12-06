const stripe = require('stripe')("sk_test_51LvlB4EWY8OoHNRBrlv7XnzWbvH0Mbm0LO3DQTsCSfPZSqZqrVn6Ozy91F5z19Be8h16hGJy3dscXw6gePwM7EQY00Zvx9BcRg");

//const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');
const handlerFactory = require('./handlerFactory');




// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
exports.createCashOrder = asyncHandler(async(req, res, next) => {
    // App Setting
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get Cart Depend On CartId
    const cart = await cartModel.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError(`There Is No Such Cart With Id ${req.params.cartId}`, 404));
    }


    // 2) Get Order Price Depend On Cart Price "Check If Coupon Apply"
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3) Create Order With Default PaymentMethodType Cash
    const order = await orderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice,
    });


    // 4) After Creating Order, Decrement Product Quantity, Increment product sold
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
            },
        }));
        await productModel.bulkWrite(bulkOption, {});


        // 5) clear Cart Depend On CartId
        await cartModel.findByIdAndDelete(req.params.cartId);
    }
    res.status(201).json({ status: 'Success', data: order });
});


exports.filterOrderForLoggedUser = asyncHandler(async(req, res, next) => {
    if (req.user.role === 'user') req.filterObject = { user: req.user._id };
    next();
});


// @desc    Get All Orders For Admin
// @route   GET /api/v1/orders/
// @access  Protected/User-Admin-Manager
exports.getAllOrders = handlerFactory.getAllItems(orderModel);



// @desc    Get Specific Order By Id
// @route   GET /api/v1/orders/Id
// @access  Protected/User-Admin-Manager
exports.getSpecificOrder = handlerFactory.getOneItem(orderModel);




// @desc    Update Specific Order Status To Paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async(req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`There Is No Any Order For This Id`, 404));
    }

    // Update Order To Paid
    order.isPaid = true;
    order.paidAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json({ status: 'Success', data: updateOrder });
});



// @desc    Update Specific Order Status To Delivered
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async(req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`There Is No Any Order For This Id`, 404));
    }

    // Update Order To Paid
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json({ status: 'Success', data: updateOrder });
});




// @desc    Get CheckOut Session From Strip And Send It As Response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkoutSession = asyncHandler(async(req, res, next) => {
    // App Setting
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get Cart Depend On CartId
    const cart = await cartModel.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError(`There Is No Such Cart With Id ${req.params.cartId}`, 404));
    }

    console.log(cart);

    // 2) Get Order Price Depend On Cart Price "Check If Coupon Apply"
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3) Create Stripe CheckOut Session
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            quantity: 1,
            price_data: {
                currency: "egp",
                unit_amount: totalOrderPrice * 100,
                product_data: {
                    name: req.user.name,
                },
            },
        }, ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress,
    });


    // 4) send session to response
    res.status(200).json({ status: 'success', session });
});




// const transformedItems = {
//     quantity: 1,
//     price_data: {
//         currency: "gbp",
//         unit_amount:  totalOrderPrice * 100,
//         product_data: {
//             name: req.user.name,
//         },
//     },
// };

// const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     // shipping_rates: ["shr_1LkVMHSArY9HEMGlxjejfRWf"],
//     shipping_address_collection: {
//         allowed_countries: ["GB", "US", "CA"],
//     },
//     line_items: transformedItems,
//     mode: "payment",
//     success_url: `${process.env.HOST}/success`,
//     cancel_url: `${process.env.HOST}/checkout`,
//     metadata: {
//         email,
//         images: JSON.stringify(items.map((item) => item.image)),
//     },
// });


//     // 3) Create stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//         line_items: [
//         {
//         //   name: req.user.name,
//             // price: totalOrderPrice * 100,
//             price: '{{PRICE_ID}}',
//         //   currency: 'egp',
//             quantity: 1,
//         },
//     ],
//         mode: 'payment',
//         success_url: `${req.protocol}://${req.get('host')}/orders`,
//         cancel_url: `${req.protocol}://${req.get('host')}/cart`,
//         // customer_email: req.user.email,
//         // client_reference_id: req.params.cartId,
//         // metadata: req.body.shippingAddress,
//     });






// @desc    Get WebHooks CheckOut
// @route   GET /api/v1/orders/webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async(req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        console.log('Create Order Here......');
    }
});



// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User




exports.createCardOrder = async(session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const oderPrice = session.amount_total / 100;

    const cart = await cartModel.findById(cartId);
    const user = await userModel.findOne({ email: session.customer_email });

    // 3) Create order with default paymentMethodType card
    const order = await orderModel.create({
        user: user._id,
        cartItems: cart.cartItems,
        shippingAddress,
        totalOrderPrice: oderPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethodType: 'card',
    });

    // 4) After creating order, decrement product quantity, increment product sold
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
            },
        }));
        await productModel.bulkWrite(bulkOption, {});

        // 5) Clear cart depend on cartId
        await cartModel.findByIdAndDelete(cartId);
    }
};