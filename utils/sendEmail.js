const nodemailer = require('nodemailer');


// nodemailer

const sendEmail = async(options)=>{
    // 1) Create Transporter (Service That Will Send Email like 'Gmail'. 'Mailgun, 'mialtrap', 'sendGrid')

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });


    // 2) Define Email Options (Like From, To, Subject, Email Content)
    const mailOption ={
        from: 'E-shop App <is1521@fayoum.edu.eg>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // Send Email
    await transporter.sendMail(mailOption);
};

module.exports = sendEmail;

