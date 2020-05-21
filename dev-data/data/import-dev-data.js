const mongoose = require('mongoose')
const dot_env = require("dotenv")
const fs = require('fs')
dot_env.config({path:'./config.env'})

mongoose.connect(process.env.DATABASE,{
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
}).then(()=>console.log("database connected"))

//require tour model schema

const Tour = require("./../../models/TourModel.js")

//read data from file

const readTour = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,"utf-8"))

//now make delete and upload data in file

const deleteData = async ()=>
{
    try{
        console.log("im here")
        await Tour.deleteMany()
        console.log("deleted successfully!!!!!!!!!!!!!!!!")
    }catch(err)
    {
        console.log(err)
    }
}
const importData = async ()=>
{
    
    try{
        await Tour.create(readTour)
        console.log("imported successfully!!!!!!!!!!!!!!!!")
    }catch(err)
    {
        console.log(err)
    }
}
console.log(process.argv)

//deletion or import by cli
if(process.argv[2]=="--import")
{
importData()
}
else if(process.argv[2]=="--delete")
{
    deleteData()

}
