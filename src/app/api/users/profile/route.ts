import { getDatafromToken } from "@/helpers/getDatafromToken";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
      try {
           const userId=await getDatafromToken(request)
          const user = await User.findOne({_id: userId}).select("-password");
        return NextResponse.json({
            mesaaage: "User found",
            data: user
        })
      } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
      }
}