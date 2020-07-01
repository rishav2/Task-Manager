const mongoose = require('mongoose')
const CompanySchema = new mongoose.Schema(
    { name:{
        type:String,
        required:[true,"a company must have name"],
    },
    address:{
        type:String,
        required:[true,"a company must have address"],
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
}
)