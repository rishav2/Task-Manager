const mongoose = require('mongoose')
const TaskSchema = new mongoose.Schema(
    { name:{
        type:String,
        required:[true,"a task must have name"],
    },
    description:{
        type:String,
        required:[true,"a task must have description"],
        minlength:[10,"description must be greater than 10 digits"],
        maxlength:[100,"description must be less than 100 digits"]
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserModel'
    }
}
)

const TaskModel = mongoose.model("TaskModel",TaskSchema) 

module.exports = TaskModel