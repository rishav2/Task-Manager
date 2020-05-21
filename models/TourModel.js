const mongoose = require('mongoose')
const TourSchema = new mongoose.Schema(
    { name:{
        type:String,
        required:[true,"a schema must have price"],
        unique:true,
        minlength:[4,"name must be greater than 4 digits"],
        maxlength:[10,"name must be less than 10 digits"]
    },
    price:{
        type:Number,
        required:[true,"a tour must have price"]
    },
    duration:{
        type:Number,
        required:[true,"a tour must have duration"]

    },
    maxGroupSize:{
        type:Number,
        required:[true,"a tour must have group size"]

    },
    difficulty:{
        type:String,
        required:[true,"a tour must have difficulty"],
        enum:{
            values:["easy","medium","hard"], 
            message:"only easy medium hard are allowed"
        }

    },

    ratingsAverage:{
        type:Number,
        default:4.5,
        max:5,
        min:0
    },
    ratingsQuantity:{
        type:Number,
        default:0

    },
    priceDiscount:Number,
    summary:{
        type:String,
        required:[true,"a tour must have summary"],
        trim:true

    },
    description:{
        type:String,
        required:[true,"a tour must have description"],
        trim:true

    },
    imageCover:{
        type:String,
        required:[true,"a tour must have image"]

    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now

    },
    startDates:[Date]

    },
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
)

TourSchema.virtual("durationWeeks").get(function(){
    return this.duration/7
})

const TourModel = mongoose.model("TourModel",TourSchema) 

module.exports = TourModel