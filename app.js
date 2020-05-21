const express = require('express')
const app = express()

const AppError = require('./utils/AppError')
const ErrorGlobal = require("./controller/errorController")

app.use(express.json())
if(process.env.NODE_ENV==="development")
{
app.use((req,res,next)=>
{
    console.log("we are in middleware")
    next()
})
}
app.use((req,res,next)=>
{
    console.log(new Date().toISOString())
    next()
})

const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")

app.use("/api/v1/tours",tourRouter)
app.use("/api/v1/users",userRouter)

app.all("*",(req,res,next)=>{
    next(new AppError(`request to this recource ${req.originalUrl} not exist`,404))

})

app.use(ErrorGlobal)

module.exports = app





