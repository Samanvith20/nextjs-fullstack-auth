import nodemailer from "nodemailer"
import bcryptjs from 'bcryptjs';
import User from "@/models/usermodel";

export const sendemail = async({email, emailType, userId}:any)=>{
     const hashedToken= await bcryptjs.hash(userId.tostring(),10)
      if (emailType==="VERIFY") {
        await User.findByIdAndUpdate(userId,{
            verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000}
        )}
       else if (emailType === "RESET"){
        await User.findByIdAndUpdate(userId, 
            {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        
      }
     try {
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.MAILTRAPUSER,
              pass: process.env.MAILTRAPPASSWORD
            }
          });
          const emailContent = `
<p>
    Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>
    to 
    ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
    or copy and paste the link below in your browser. <br> 
    ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
</p>
`;

const mailOptions = {
    from: 'yervala@gmail.com',
    to: email,
    subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
    html: emailContent
};
const mailresponse = await transport.sendMail
(mailOptions);
return mailresponse;

     } catch (error:any) {
        throw new Error(error.message);
        
     }

}