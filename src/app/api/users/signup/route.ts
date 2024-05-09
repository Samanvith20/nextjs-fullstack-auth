import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import connectDb from "@/Database/db";

connectDb()

  export async function POST(request:NextRequest){
      try {
         const reqBody=await request.json()
          const {username,email,password}=reqBody
           console.log(reqBody);
           
            const user=await User.findOne({email})
            if(user){
                 return NextResponse.json({error:"user already exist"},{status:400})
            }
            //hash the password
            const salt=await bcryptjs.genSalt(10)
            const hashedPassword=await bcryptjs.hash(password, salt)

            
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        // send email
         await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})
         return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })


      } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
      }
  }