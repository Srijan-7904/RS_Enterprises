import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        unique:true,
        sparse:true
    },
    password:{
        type:String
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    },
    cartData:{
        type:Object,
        default:{}
    }
},{timestamps:true , minimize:false})

const User = mongoose.model("User",userSchema)

export default User