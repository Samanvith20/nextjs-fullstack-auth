import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import connectDb from "@/Database/db";
import jwt from "jsonwebtoken"
connectDb()
  export  async function POST(request:NextRequest){
              try {
                 const reqBody=await request.json()

                 const{email,password}=reqBody

                 console.log(reqBody);

                 //check the user exist
                  const user=await User.findOne({email})
                  if(!user){
                    return NextResponse.json({error: "User does not exist"}, {status: 400})
                  }

                  //check  the password
                  const validpassword= await bcryptjs.compare(password,user.password)
                  if(!validpassword){
                    return NextResponse.json({error: "Invalid password"}, {status: 400})
                  }
                  console.log(user);

                  //generate token data
                  const tokenData={
                    id:user._id,
                    username:user.username,
                    email:user.email
                  }
                  
                  //genertate token using JWT
                  const token=jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
                  
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
            
        })
        return response;
                  
                  

              } catch (error:any) {
                return NextResponse.json( {error:error.message},{status:500})
              }
  }