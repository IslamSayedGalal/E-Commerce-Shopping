const path = require('path');

//const Stripe = require('stripe');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const dotenv = require('dotenv');
const morgan = require("morgan");
const cors = require('cors');
const compression = require('compression')
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');


// eslint-disable-next-line node/no-unpublished-require
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalErrorMiddleWare = require('./middleware/errorMiddleWare');

// -------------------- Routes ---------------------
const { mountRoutes } = require('./routes/index');
const { createCardOrder } = require('./services/orderServices');

// const {webHookCheckOut} = require('./services/orderServices');
dotenv.config({ path: 'config.env' });

// Connect To DataBase
dbConnection();

// express app
const app = express();

// Enable All Domain To Access The API
app.use(cors());
app.options('*', cors());

// compress all responses
app.use(compression())

app.use(bodyParser.json())


// webhooks checkout
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), asyncHandler(async(req, res, next) => {

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        //  Create order
        console.log('Create Order Here......');
        console.log(event.data.object.client_reference_id);
        createCardOrder(event.data.object);
    }

    res.status(200).json({ received: true });
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));


if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode : ${process.env.NODE_ENV}`);
};



// Mount Routes
mountRoutes(app);


app.all('*', (req, res, next) => {
    // Create Error And Send It To Error Handling MiddleWare
    // const err = new Error(`Can't Find This Route ${req.originalUrl}`);
    // next(err.message);
    next(new ApiError(`Can't Find This Route ${req.originalUrl}`, 400));
});

// Global Error Handling MiddleWare
app.use(globalErrorMiddleWare);


const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => {
    console.log(`App Running On Port ${PORT}`);
});


// Event ==> listen ==> CallBack(err)
process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors ${err.name} | ${err.message}`);
    server.close(() => {
        console.log("Shutting Down.....");
        process.exit(1);
    })
})