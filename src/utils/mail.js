import Mailgen  from "mailgen";
import nodemailer from "nodemailer";


const registerEmailContent= (username,verificationLink) => {
  return {
    body: {
        name: 'Hello '+username,
        intro: 'Welcome to Project Management! We\'re very excited to have you on board.',
        action: {
            instructions: 'To get started, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: verificationLink,
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
}
};
const resetPasswordContent= (username,passwordRestLink) => {
  return {
    body: {
        name: 'Hello '+username,
        intro: 'We received a request to reset your password for your account.',
        action: {
            instructions: 'To reset your password, please click here:',
            button: {
                color: '#b9bc22', // Optional action button color
                text: 'Reset your password',
                link: passwordRestLink,
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
}
};

///options={email,subject,mailContent}
const sendEmail = async (options)=>{

  //A transporter is an object that handles the connection to 
  // your email service and sends messages on your behalf.
const transporter= nodemailer.createTransport({
  host: process.env.ETHEREAL_SMTP_HOST,
  port: process.env.ETHEREAL_SMTP_PORT,
  auth: {
    user: process.env.ETHEREAL_SMTP_USER,
    pass: process.env.ETHEREAL_SMTP_PASSWORD,
  },
  
});
try {
  await transporter.verify();
  console.log("Server is ready to take our messages");
} catch (err) {
  console.error("Email Transporter Verification failed:", err);
 return;
}

 // Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Project Management',
        link: 'https://mailgen.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});


//preparing the email contents using the mailGenerator created above
const emailHtml = mailGenerator.generate(options.mailContent);
const emailTexual = mailGenerator.generatePlaintext(options.mailContent);
  const mail ={
    from:"saqibwani273@gmail.com",
    to : options.email,
    subject:options.subject,
    html:emailHtml, // if html is not supported, mailgen will generate plain text email
    text: emailTexual,
  }

  //sending the email in try catch
  try{
await transporter.sendMail(mail);

  }catch(err){
console.error("Error while sending mail:", err);
  }
}

export {registerEmailContent,resetPasswordContent,sendEmail}