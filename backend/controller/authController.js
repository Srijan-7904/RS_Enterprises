import User from "../model/userModel.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import { genToken, genToken1 } from "../config/token.js";
import crypto from "crypto";
import nodemailer from "nodemailer";


export const registration = async (req,res) => {
  try {
    const {name , email, phone, password} = req.body;
    const existEmail = await User.findOne({email})
    if(existEmail){
        return res.status(400).json({message:"Email already exist"})
    }
    const existPhone = await User.findOne({phone})
    if(existPhone){
        return res.status(400).json({message:"Phone number already exist"})
    }
    if(!validator.isEmail(email)){
         return res.status(400).json({message:"Enter valid Email"})
    }
    if(password.length < 8){
        return res.status(400).json({message:"Enter Strong Password"})
    }
    let hashPassword = await bcrypt.hash(password,10)

    const user = await User.create({name,email,phone,password:hashPassword})
    let token = await genToken(user._id)
    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.status(201).json(user)
  } catch (error) {
    console.log("registration error")
    return res.status(500).json({message:`registration error ${error}`})
  }
    
}


export const login = async (req,res) => {
    try {
        let {email, phone, password} = req.body;
        
        // Find user by email or phone
        let user;
        if(email){
            user = await User.findOne({email});
        } else if(phone){
            user = await User.findOne({phone});
        } else {
            return res.status(400).json({message:"Email or phone number required"});
        }
        
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        
        if(!user.password){
            return res.status(400).json({message:"Please login with Google"})
        }
        
        let isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect password"})
        }
        let token = await genToken(user._id)
        res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.status(201).json(user)

    } catch (error) {
         console.log("login error")
    return res.status(500).json({message:`Login error ${error}`})
        
    }
    
}
export const logOut = async (req,res) => {
try {
    res.clearCookie("token")
    return res.status(200).json({message:"logOut successful"})
} catch (error) {
    console.log("logOut error")
    return res.status(500).json({message:`LogOut error ${error}`})
}
    
}


export const googleLogin = async (req,res) => {
    try {
        let {name , email} = req.body;
         let user = await User.findOne({email}) 
        if(!user){
          user = await User.create({
            name,email
        })
        }
       
        let token = await genToken(user._id)
        res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json(user)

    } catch (error) {
         console.log("googleLogin error")
    return res.status(500).json({message:`googleLogin error ${error}`})
    }
    
}


// Forgot Password - Send Reset Email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if(!email){
            return res.status(400).json({message:"Email is required"});
        }
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        // Set expire time (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        
        await user.save();
        
        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        // Email configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request - RS Enterprises',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1488aa;">Password Reset Request</h2>
                    <p>Hi ${user.name},</p>
                    <p>You requested to reset your password. Click the button below to reset it:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #1488aa, #2d8a4d); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="color: #1488aa; word-break: break-all;">${resetUrl}</p>
                    <p style="color: #666; font-size: 14px;">This link will expire in 10 minutes.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">RS Enterprises - Security Solutions</p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ 
            message: "Password reset email sent successfully",
            success: true 
        });
        
    } catch (error) {
        console.log("Forgot password error:", error);
        return res.status(500).json({ message: `Error sending reset email: ${error.message}` });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if(!token || !newPassword){
            return res.status(400).json({message:"Token and new password are required"});
        }
        
        if(newPassword.length < 8){
            return res.status(400).json({message:"Password must be at least 8 characters"});
        }
        
        // Hash token to compare with stored token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        
        // Hash new password
        const hashPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password and clear reset fields
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save();
        
        return res.status(200).json({ 
            message: "Password reset successful",
            success: true 
        });
        
    } catch (error) {
        console.log("Reset password error:", error);
        return res.status(500).json({ message: `Error resetting password: ${error.message}` });
    }
};


export const adminLogin = async (req,res) => {
    try {
        let {email , password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        let token = await genToken1(email)
        res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite: "None",
        maxAge: 1 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json(token)
        }
        return res.status(400).json({message:"Invaild creadintials"})

    } catch (error) {
        console.log("AdminLogin error")
    return res.status(500).json({message:`AdminLogin error ${error}`})
        
    }
    
}

