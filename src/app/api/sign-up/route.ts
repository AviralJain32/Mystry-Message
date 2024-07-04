import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs"

export async function POST(request:Request){
    await dbConnect()
    try {
        const {username,email,password}=await request.json()

        const existingUserVerifiedByUsername=await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"username is already taken"
            })
        }
        const existingUerByEmail=await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUerByEmail){
            if(existingUerByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exist with this email"
                },{
                    status:400
                })
            }
            else{
                const hashedPassword=await bcryptjs.hash(password,10)
                existingUerByEmail.password=hashedPassword;
                existingUerByEmail.verifyCode=verifyCode;
                existingUerByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)

                await existingUerByEmail.save()
            }
        }
        else{
            const hashedPassword=await bcryptjs.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser=new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUser.save()
        }
        //send verification email
        const emailResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{
                status:500
            })
        }
        return Response.json({
            success:true,
            message:"User Registered Successfully. Please verify your email"
        },{status:201})

    } catch (error) {
        console.error("Error registering user",error)
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}