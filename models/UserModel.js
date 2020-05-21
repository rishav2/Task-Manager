const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

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
    photo:String,
    role:{
        type:String,
        enum:["admin","user","guide","lead-guide"],
        default:"user"
    },
    password:{
        type:String,
        required:[true,"please provide password"],
        minlength:8,
        select:false
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
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpire:Date

})
userSchema.pre("save", function(next){
    if(!this.isModified("password") || this.isNew()) return next()

    this.passwordChangedAt = Date.now() - 1000
        
})

userSchema.pre("save",async function(next){
//check if password is modified or not
if(!this.isModified("password")) return next()

//encrypt the password using bcrypt algorithm
this.password = await bcrypt.hash(this.password,12)

//set password confirm value to undefined
this.passwordConfirm = undefined
})

//compare method on all userschema mehods
userSchema.methods.correctPassword= async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

//compare if password is changed after jwt is issued
userSchema.methods.changedPassword = async function(JWTTimeStamp){
    if(this.passwordChangedAt)
    {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        return JWTTimeStamp<changedTimeStamp //true corresponds to password change
    }
    return false

}

//create Password reset token

userSchema.methods.createPasswordResetToken = function()
{
    const resetToken = crypto.randomBytes(32).toString("hex")

    this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpire = Date.now() + 10*60*1000

    return resetToken
}

const User = mongoose.model("User",userSchema)

module.exports = User
