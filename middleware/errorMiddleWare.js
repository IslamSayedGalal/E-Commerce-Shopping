const ApiError = require('../utils/apiError');

const sendErrorForDev = (err,res)=>{
    res.status(err.statusCode).json({
                status: err.status,
                error: err,
                message: err.message,
                stack: err.stack,
            });
    
};


const sendErrorForProd = (err,res)=>{
    res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
    
};


const handleJwtInvalidSignature = () =>
    new ApiError('Invalid Token, Please Login Again...', 401);

const handleJwtTokenExpired = ()=>
    new ApiError('Expired Token, Please Login Again...', 401);

const globalErrorMiddleWare = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV === 'development'){
        sendErrorForDev(err,res);
    }else{
        if(err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
        if(err.name === 'TokenExpiredError') err = handleJwtTokenExpired();
        sendErrorForProd(err,res);
    }
};


module.exports = globalErrorMiddleWare;