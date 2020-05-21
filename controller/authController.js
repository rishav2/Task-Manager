const User = require("./../models/UserModel")
const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/AppError")
const jwt = require("jsonwebtoken")
const {promisify}= require("util")
const email = require("./../utils/email")
const crypto = require("crypto")


const signToken = id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY
    })
}

const sendToken = (id,statusCode)=>{
    const token = signToken(id)
        res.status(statusCode).json({
            status:"success",
            token,
            
        })

}
//for signup
exports.signup = catchAsync(async (req,res,next)=>
{
    const newUser = await User.create(req.body)

    const token = signToken(newUser._id)

    res.status(201).json({
        status:"success",
        token,
        data:{
            user:newUser
        }
    })

})
//for login

exports.login = catchAsync(
    async (req,res,next) =>{
        //check if email and password exist
        const {email,password} = req.body
        if(!email || !password) return next(new AppError("please provide email and password"),404)

        //check if user and password exist
        const user =  await User.findOne({email}).select("+password")

        if(!user || !(await user.correctPassword(password,user.password)) )
        {
            return next(new AppError("email or password is incorrect"),404)

        }
        //then sign web token and send to client
       sendToken(user._id,201)


    }

)
//protected routes
exports.protect = catchAsync(
    async (req,res,next)=>{
        let token = undefined
        //get the token or if it is there
    
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        {
            token = req.headers.authorization.split(" ")[1]
        }

        if(!token)
        {
            return next(new AppError("you are not logged in "),401)
        }

        //verification of token
       const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET)

       //check if user beloging to this jwt still exist
       const currentUser = await User.findById(decoded.id) 
       if(!currentUser)
       {
           return next(new AppError("user belonging to htis jwt doesnt exist",401))
       }

       //check if user has changed the password after jwt has 
       if(!currentUser.changedPassword(decoded.iat)){
           return next(new AppError("Password is changed please login again"))
       }

       req.user = currentUser

        next()
    }
)

//restriction to certain routes based on roles
exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            return next(new AppError("You are not authorised to do that",403))
        }
        next()
    }
}

//forgot password 

exports.forgotPassword = catchAsync(
    async (req,res,next)=>
    {
        //get the user based on email provided
        const user =  await User.findOne({email:req.body.email})
        if(!user)
        {
            return next(new AppError("no such user exist"),403)
        }

        //create password reset token
        const resetToken = user.createPasswordResetToken()
        await user.save({validateBeforeSave:false})

        //send it through mail  
        const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`
        console.log(resetURL)

        const message = `Forgot your password submit a patch request with your new password to ${resetURL}\n if you don't please ignore message`
        
        try{
         await email({
            email:user.email,
            subject:"your password reset token expires in 10 minutes",
            message
        })

        res.status(200).json({
            status:"success",
            message:"Token sent to email"
        })
    }catch(err)
    {
        user.passwordResetToken = undefined 
        user.passwordResetExpire = undefined 

        await user.save({validateBeforeSave:false})

        return next(new AppError("there's a problem in sendin mails"),500)

    }

    }
)

//reset password

exports.resetPassword = async (req,res,next) =>{
    //get user based on token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    
    const user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpire:{$gt:Date.now()}})

    //if token has not expired and there is user , set new password
    if(!user)
    {
        return next(new AppError("Token has expired"),400)
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined
    user.passwordResetExpire = undefined

    await user.save();

    

    //login the user and send jwt to him
    sendToken(user._id,201)
}

exports.updatePassword = catchAsync( async (req,res,next) =>{
    // get user from collection

    const user = await User.findById(req.user._id).select("+password")
    //check if posted password is correct
    if(!User.correctPassword(req.body.oldPassword,user.password)){
        return next(new AppError("old password is not correct"),400)
    }

    //then update password
    user.password = req.body.newPassword
    user.passwordConfirm = req.body.passwordConfirm
    user.save()

    //login user
    sendToken(user._id,201)
})