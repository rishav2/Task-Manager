const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: [true,"user must have a name"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        validate:[validator.isEmail,"email is not valid"],
        lowercase:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    password:{
        type:String,
        required:[true,"please provide password"],
        minlength:8,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
    },
})


const User = mongoose.model("User1",userSchema)

module.exports = User
