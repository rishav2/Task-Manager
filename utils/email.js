const nodemailer = require("nodemailer") 

const sendEmail = async options =>{ 
    //create a transporter 
    const transporter = nodemailer.createTransport({
        host:process.env.HOST,
        port:process.env.PORT1,
        auth:{
            user:process.env.USERNAME_MAIL,
            pass:process.env.USERNAME_PASSWORD
        }
    })

    //define email options 
    const mailOptions = {
        from:"Rishav Sharma <rishav@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        //to: options.email
    }

    //send email with noedmailer 

    await transporter.sendMail(mailOptions)

} 

module.exports = sendEmail