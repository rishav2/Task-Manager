const mongoose = require('mongoose')
const dot_env = require("dotenv")
dot_env.config({path:'./config.env'})

//uncaught exception
process.on("uncaughtException",err=>{
    console.log(err.name,err.message)
    console.log("Unhandles rejection  shut down")
    process.exit(1)
    })


const app = require("./app")

mongoose.connect(process.env.DATABASE,{
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
}).then(()=>console.log("database connected"))


const server = app.listen(process.env.PORT,()=>{
console.log(`server is listening at port ${process.env.PORT}`)
})


//unhandled promise rejections

process.on("unhandledRejection",err=>{
    console.log(err.name,err.message)
    console.log("Unhandles rejection  shut down")

    server.close(()=>
    {
        process.exit(1)
    })

})
