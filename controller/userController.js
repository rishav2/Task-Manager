const User = require('./../models/UserModel');
const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/AppError")

exports.getAllUsers = catchAsync(async (req,res,next)=>
{
    
    const users = await User.find()

    res.status(200).json({
      status: 'ok',
      results:users.length,
    data:{  
    users
    }
})
    
})

exports.createUser = (req,res)=>
{
    res.status(500).json(
        {
            status:"successs",
            message:"no response yet"
        }
    )
}
exports.getUserById = (req,res)=>
{
    res.status(500).json(
        {
            status:"successs",
            message:"no response yet"
        }
    )
}
exports.updateUser = (req,res)=>
{
    res.status(500).json(
        {
            status:"successs",
            message:"no response yet"
        }
    )
}
exports.deleteUser = (req,res)=>
{
    res.status(500).json(
        {
            status:"successs",
            message:"no response yet"
        }
    )
}
