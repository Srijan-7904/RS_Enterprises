import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import Logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import google from '../assets/google.png'
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios'
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { userDataContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import Loading from '../component/Loading';
import TypingText from '../component/TypingText'

function Registration() {
    let [show, setShow] = useState(false)
    let { serverUrl } = useContext(authDataContext)
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [phone, setPhone] = useState("")
    let [password, setPassword] = useState("")
    let { userdata, getCurrentUser } = useContext(userDataContext)
    let [loading, setLoading] = useState(false)

    let navigate = useNavigate()

const handleSignup = async (e) => {
    e.preventDefault();  
    setLoading(true);

    console.log("Sending =>", {name, email, password});

    if (!name || !email || !phone || !password) {
        toast.error("All fields required");
        setLoading(false);
        return;
    }

    try {
        const result = await axios.post(
            serverUrl + '/api/auth/registration',
            { name, email, phone, password },
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );

        console.log("Backend returned:", result.data);

        getCurrentUser();
        navigate("/");
        toast.success("User Registration Successful");

    } catch (error) {
        console.log("ERROR RESPONSE:", error.response?.data);
        toast.error(error.response?.data?.message || "Registration failed");
    }

    setLoading(false);
};


    const googleSignup = async () => {
        try {
            const response = await signInWithPopup(auth , provider)
            let user = response.user
            let name = user.displayName;
            let email = user.email

            const result = await axios.post(serverUrl + "/api/auth/googlelogin" ,{name , email} , {withCredentials:true})
            console.log(result.data)
            getCurrentUser()
            navigate("/")
            toast.success("User Registration Successful")

        } catch (error) {
            console.log(error)
            toast.error("User Registration Failed")
        }
        
    }
  
    return (
        <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] flex items-center justify-center'>
            <div className='max-w-[1000px] w-[95%] h-[80vh] rounded-lg overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2 border-2 border-[#b8dce8]'>

                <div className='left-panel flex flex-col items-start justify-center p-10 bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] text-white'>
                    <img src={Logo} className='w-[56px] mb-6' alt='logo' />
                    <h2 className='text-3xl font-bold mb-2'>Join OneCart</h2>
                    <p className='text-white/90 mb-6 max-w-[360px] font-medium'>Create your account and start placing orders with ease.</p>
                      <div className='gif-gradient absolute inset-0 opacity-0 pointer-events-none' aria-hidden />
                      <TypingText phrases={["Exclusive Deals","Personalized Picks","Secure Payments","Order Tracking"]} className='text-2xl font-semibold text-white/95 relative z-10' />
                </div>

                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className='right-panel flex items-center justify-center p-8 bg-white'>
                      <form action="" onSubmit={handleSignup} className='w-full max-w-[360px] flex flex-col gap-4' aria-label='Registration form'>
                        <motion.div whileHover={{ scale: 1.02 }} className='w-full h-[48px] bg-white rounded-lg flex items-center justify-center gap-[10px] py-[8px] cursor-pointer border-2 border-[#b8dce8] hover:border-[#1488aa] transition-all shadow-sm hover:shadow-md' onClick={googleSignup}>
                            <img src={google}  alt="" className='w-[20px]'/> <span className='text-[#0a5f7a] font-semibold'>Continue with Google</span>
                        </motion.div>

                        <div className='flex items-center gap-3 w-full'><div className='h-[1px] bg-[#b8dce8] flex-1'/><span className='text-[#3a5a65] font-semibold'>OR</span><div className='h-[1px] bg-[#b8dce8] flex-1'/></div>

                        <input autoFocus id='signup-name' name='name' type='text' className='w-full h-[48px] border-[2px] border-[#b8dce8] rounded-lg bg-[#f5f9fc] placeholder-[#5a8899] px-4 font-semibold text-[#0a5f7a] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all' placeholder='UserName' required onChange={(e)=>setName(e.target.value)} value={name} aria-label='User name' />
                        <input id='signup-email' name='email' type='email' className='w-full h-[48px] border-[2px] border-[#b8dce8] rounded-lg bg-[#f5f9fc] placeholder-[#5a8899] px-4 font-semibold text-[#0a5f7a] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all' placeholder='Email' required onChange={(e)=>setEmail(e.target.value)} value={email} autoComplete='email' aria-label='Email' />
                        <input id='signup-phone' name='phone' type='tel' className='w-full h-[48px] border-[2px] border-[#b8dce8] rounded-lg bg-[#f5f9fc] placeholder-[#5a8899] px-4 font-semibold text-[#0a5f7a] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all' placeholder='Phone Number' required onChange={(e)=>setPhone(e.target.value)} value={phone} autoComplete='tel' aria-label='Phone number' />

                        <div className='relative'>
                            <input id='signup-password' name='password' type={show?"text":"password"} className='w-full h-[48px] border-[2px] border-[#b8dce8] rounded-lg bg-[#f5f9fc] placeholder-[#5a8899] px-4 font-semibold text-[#0a5f7a] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all' placeholder='Password' required onChange={(e)=>setPassword(e.target.value)} value={password} autoComplete='new-password' aria-label='Password' />
                            <div className='absolute right-3 top-3 text-[#1488aa] cursor-pointer' onClick={()=>setShow(prev => !prev)}>{show? <IoEye/> : <IoEyeOutline/>}</div>
                        </div>

                        <button className='w-full h-[48px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] rounded-lg flex items-center justify-center mt-2 text-[17px] font-semibold text-white hover:shadow-[0_0_20px_rgba(20,136,170,0.3)] transition-all'>{loading? <Loading/> :"Create Account"}</button>

                        <p className='text-center text-[#3a5a65] mt-2 font-medium'>Already have an account? <span className='text-[#1488aa] font-bold cursor-pointer hover:underline' onClick={()=>navigate("/login")}>Login</span></p>
                    </form>
                </motion.div>

            </div>
        </div>
    )
}

export default Registration
