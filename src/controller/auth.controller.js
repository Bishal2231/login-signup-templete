 import { User } from "../model/user.model.js"
 import bcryptjs from "bcryptjs"
//  import Cryptojs from "crypto-js"
import crypto from "crypto"
import { sendVerificationEmail } from "../mailtrap/email.js"
 import { generateVerificationCOde } from "../utility/generateVerificationCode.js"
 import { sendWelcomeEmail } from "../mailtrap/email.js"
 import { generateTokenAndSetCookie } from "../utility/generateTokenAndSetCookie.js"
 import { sendPasswordResetEmail } from "../mailtrap/email.js"
 import { sentResetSuccessEmail } from "../mailtrap/email.js"
 export const signup=async (req,res)=>{
    try {
    const {email,password,name}=req.body

    if(!email||!password||!password){
        throw new Error("invalid email")
    }

    const userAlreadyExits=await User.findOne({email})

    if(userAlreadyExits){
        return res.status(400).json({success:false,message:"user already exits"})
    }
    const hashPassword=await bcryptjs.hash(password,10)

     const verificationToken=  generateVerificationCOde()
     
    const user=new User({
        email,
        password:hashPassword,
        name,
        verificationToken,
        verificationTokenExpiresAt:Date.now()+24*60*60*1000
    
    
    
    
        
    })
    await user.save()
    console.log(user)

    generateTokenAndSetCookie(res,user._id)
    await sendVerificationEmail(user.email,verificationToken)

    res.status(200).json({
        success:true,
        message:"sing up successful",
        user:{
            ...user._doc,
            password:undefined
        }

    })



    } 
    catch (error) {
console.log(error)}



}

export const verifyemail=async(req,res)=>{
try {
    
     const {code}=req.body

     const user= await User.findOne({
        verificationToken:code,
        verificationTokenExpiresAt:{$gte:Date.now()}


     })
     if(!user){
        return res.status(400).json({success:false,message:"invalid or expired verification code"})
     }
     user.isVerified=true;
     user.verificationToken=undefined;
     user.verificationTokenExpiresAt=undefined;
     await user.save()
     await sendWelcomeEmail(user.email,user.name)
    //  (verificationToken===code)
    return res.status(200).json({
        success:true,
        message:"email verified successfully",
        user:{
            ...user._doc,password:undefined
        }
    })

} catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
}
}

export const forgetpassword=async(req,res)=>{
    const {email}=req.body
    
    try {
        
        const user=await User.findOne({email})
        if(!user){
            throw new Error("invalid creditencial")
        }
//         const verificationToken=generateVerificationCOde()

//        await sendVerificationEmail(email,verificationToken)
//        user.verificationToken=verificationToken;
//   await user.save();



// genretate reset token

const resetToken=crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAr=Date.now()+1*60*60*60*1000;

user.resetPasswordToken=resetToken;
user.resetPasswordExpiresAt=resetTokenExpiresAr;

await user.save();

// send email
await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-pasword/${resetToken}`);

return res.status(200).json({success:true,message:"reset email sent"})


    } catch (error) {
            console.log(error)
        return res.status(200).json({success:false,message:"foregt passwo unsuccessfull"})

        
    }
    

}
export const login=async (req,res)=>{

const {email,password}=req.body
try {
    const user=findOne({email})
    
    if(!user){
        return res.status(400).json({success:false,message:"user doesnot exits"})
    }
    const userPassword=await bcryptjs.compare(password,user.password)
    if(!userPassword){
        return res.status(400).json({success:false,message:"password doesnot exits"})
    
    }
    generateTokenAndSetCookie(res,user._id)
    user.lastlogin=new Date;
    await user.save()
    return res.status(200).json({success:true,message:"login successfull"})
    
    
    
    
  
} catch (error) {
    console.log(error)
    return res.status(200).json({success:false,message:"login unsuccessfull"})

}




}

export const logout=async (req,res)=>{
    res.clearCookie("token")
    res.status(200).json({success:true,message:"logout successful"})
}


export const resetPassword=async(req,res)=>{
    try {
        const {token}=req.params;
        const {password}=req.body;

        const user=await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()}
        })
        if(!user){
            return res.status(200).json({success:false,message:"invalid creditional"})
        }   
        // update password
        const hashedPassword=await bcryptjs.hash(password,10)
        user.password=hashedPassword;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpiresAt=undefined;
        await user.save();
         await sentResetSuccessEmail(user.email);
         return res.status(200).json({success:true,message:"successful reset password"})
    } catch (error) {
        console.log("error at reset password",error)
        return res.status(400).json({success:false,message:"unsucessful reset password"})

    }

    
}

export const checkAuth=async(req,res)=>{
    try {
        const user =await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(400).json({success:false,message:"user not found"})

        }
        res.status(200).json({success:true,user})

    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }

}