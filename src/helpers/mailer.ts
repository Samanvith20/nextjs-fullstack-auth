import nodemailer from "nodemailer";
import bcryptjs from 'bcryptjs';
import User from "@/models/usermodel";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // Hash the userId to generate tokens
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        // Update user document based on emailType
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000 // 1 hour expiry
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000 // 1 hour expiry
            });
        }

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAPUSER,
                pass: process.env.MAILTRAPPASSWORD
            }
        });

        // Compose email content
        const emailContent = `
            <p>
                Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>
                to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
                or copy and paste the link below in your browser. <br>
                ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>
        `;

        // Compose email options
        const mailOptions = {
            from: 'yervala@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: emailContent
        };

        // Send email
        const mailResponse = await transporter.sendMail(mailOptions);

        return mailResponse;

    } 
    catch (error:any) {
        // Handle errors
        throw new Error(error.message);
    }
};
