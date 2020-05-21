const AppError = require("./../utils/AppError")

const handleCatchException = err=>{
    const message = `Invalid ${err.path} : ${err.value}.`
    return new AppError(message,400)

}

const handleDuplicateException = err =>{
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
    const message = `Duplicate key value: ${value} add another value`
    return new AppError(message,400)
}

const handleValidationException = err =>{
  const errors = Object.values(err.errors).map(el=>el.message)

  const message = `Invalid input data ${errors.join(". ")}`

  return new AppError(message,400)
}

const handleTokenError = ()=> new AppError("invalid id ",401)
const handleJwtExpiryError = () => new AppError("jwt is already expired",401)
//error send to client
const sendProd = (res, err) => {

  //error that is trusted can send to client
  if(err.isOperational)
  {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}
  // error of outside sources non trusted
  else
  {
      //console error to console
      console.error("Error ",err)

      //send to client
      res.status(500).json({
          status: "error",
          message: "Something went wrong"
        });

  }

};
//error send during development
const sendDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack:err.stack,
        error:err
      });
    
    
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if ((process.env.NODE_ENV === 'development')) {
      console.log("we are in develpment")
    sendDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
      console.log("we are in production")
    let error = {...err}
    console.log(err)
    if(error.name==="CastError") error = handleCatchException(error) //cast error
    if(error.code===11000) error = handleDuplicateException(error)   //duplicate key error
    if(error.name==="ValidationError") error = handleValidationException(error) //validation error
    if(error.name==="JsonWebTokenError") error = handleTokenError() //invalid token error
    if(error.name==="TokenExpiredError") error = handleJwtExpiryError() //jwt expiry error
    sendProd(res,error);
  }
};
