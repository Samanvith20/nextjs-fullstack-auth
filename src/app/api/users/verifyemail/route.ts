import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

import connectDb from "@/Database/db";

connectDb()
 
 export async function POST(request:NextRequest){
     try {
        const reqBody=await request.json()
          const{token}=reqBody
             const user=await User.findOne({verifyToken:token,verifyTokenExpiry:{$gt: Date.now()}})
             if(!user){
                return NextResponse.json({error: "Invalid token"}, {status: 400})
             }
            //  console.log(user);
             user.isVerfied=true;
             user.verifyToken=undefined;
             user.verifyTokenExpiry=undefined;
             await user.save()
             return NextResponse.json({
                message: "Email verified successfully",
                success: true
            })
             
     } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
        
     }
       
 }