import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import Logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import google from '../assets/google.png'
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { MdEmail, MdPhone } from "react-icons/md";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { userDataContext } from '../context/UserContext';
import Loading from '../component/Loading';
import TypingText from '../component/TypingText'
import { toast } from 'react-toastify';

function Login() {
    let [show, setShow] = useState(false)
    let [loginMethod, setLoginMethod] = useState("email") // "email" or "phone"
    let [email, setEmail] = useState("")
    let [phone, setPhone] = useState("")
    let [password, setPassword] = useState("")
    let { serverUrl } = useContext(authDataContext)
    let { getCurrentUser } = useContext(userDataContext)
    let [loading, setLoading] = useState(false)

    let navigate = useNavigate()

    const handleLogin = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const loginData = loginMethod === "email" 
                ? { email, password } 
                : { phone, password };
                
            let result = await axios.post(serverUrl + '/api/auth/login', loginData, {withCredentials:true})
            console.log(result.data)
            setLoading(false)
            getCurrentUser()
            navigate("/")
            toast.success("User Login Successful")
            
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error(error.response?.data?.message || "User Login Failed")
        }
    }
     const googlelogin = async () => {
            try {
                const response = await signInWithPopup(auth , provider)
                let user = response.user
                let name = user.displayName;
                let email = user.email
    
                const result = await axios.post(serverUrl + "/api/auth/googlelogin" ,{name , email} , {withCredentials:true})
                console.log(result.data)
                getCurrentUser()
            navigate("/")
    
            } catch (error) {
                console.log(error)
            }
            
        }
    return (
        <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] flex items-center justify-center'>
            <div className='max-w-[1000px] w-[95%] h-[80vh] rounded-lg overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2 border-2 border-[#b8dce8]'>

                {/* LEFT - Animated text / graphics */}
                <div className='left-panel flex flex-col items-start justify-center p-10 bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] text-white'>
                    <img src={Logo} className='w-[56px] mb-6' alt='logo' />
                    <h2 className='text-3xl font-bold mb-2'>Welcome Back</h2>
                    <p className='text-white/90 mb-6 max-w-[360px] font-medium'>Sign in to continue shopping and managing your orders.</p>
                      <div className='gif-gradient absolute inset-0 opacity-0 pointer-events-none' aria-hidden />
                      <TypingText phrases={["Secure Checkout","Fast Delivery","Best Price Guarantee","24/7 Support"]} className='text-2xl font-semibold text-white/95 relative z-10' />
                </div>

                {/* RIGHT - Form */}
                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className='right-panel flex items-center justify-center p-8 bg-white overflow-y-auto'>
                      <form action="" onSubmit={handleLogin} className='w-full max-w-[360px] flex flex-col gap-4' aria-label='Login form'>
                        <motion.div whileHover={{ scale: 1.02 }} onClick={googlelogin} className='w-full h-[48px] bg-white rounded-lg flex items-center justify-center gap-[10px] py-[8px] cursor-pointer border-2 border-[#b8dce8] hover:border-[#1488aa] transition-all shadow-sm hover:shadow-md'>
                            <img src={google} alt="" className='w-[20px]'/> <span className='text-[#0a5f7a] font-semibold'>Continue with Google</span>
                        </motion.div>

                        <div className='flex items-center gap-3 w-full'><div className='h-[1px] bg-[#b8dce8] flex-1'/><span className='text-[#3a5a65] font-semibold'>OR</span><div className='h-[1px] bg-[#b8dce8] flex-1'/></div>

                        {/* Login Method Toggle */}
                        <div className='flex items-center gap-2 bg-[#e8f4f8] rounded-lg p-1'>
                            <button 
                                type='button'
                                onClick={() => setLoginMethod("email")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all font-semibold text-[14px] ${
                                    loginMethod === "email" 
                                    ? 'bg-white text-[#1488aa] shadow-sm' 
                                    : 'text-[#5a8899] hover:text-[#1488aa]'
                                }`}
                            >
                                <MdEmail className='text-[18px]'/> Email
                            </button>
                            <button 
                                type='button'
                                onClick={() => setLoginMethod("phone")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all font-semibold text-[14px] ${
                                    loginMethod === "phone" 
                                    ? 'bg-white text-[#1488aa] shadow-sm' 
                                    : 'text-[#5a8899] hover:text-[#1488aa]'
                                }`}
                            >
                                <MdPhone className='text-[18px]'/> Phone
                            </button>
                        </div>

                        {/* Email or Phone Input */}
                        {loginMethod === "email" ? (
                            <div className='relative'>
                                <input 
                                    autoFocus 
                                    id='login-email' 
                                    name='email' 
                                    autoComplete='email' 
                                    type="email" 
                                    className='w-full h-[48px] border-[2px] border-[#b8dce8] rounded-lg bg-[#f5f9fc] placeholder-[#5a8899] px-4 font-semibold text-[#0a5f7a] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all' 
                                    placeholder='Email' 
                                    required  
                                    onChange={(e)=>setEmail(e.target.value)} 
                                    value={email} 
                                    aria-label='Email' 
                                />
                            </div>
                        ) : (
                            <div className='relative'>
                                <input 
                                    autoFocus 
                                    id='login-phone' 
                                    name='phone' 
                                    autoComplete='tel' 
                                    type="tel" 
                                    className='w-full h-[48px] border-[2px] border-[#b8dce8] rounded-lg bg-[#f5f9fc] placeholder-[#5a8899] px-4 font-semibold text-[#0a5f7a] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all' 
                                    placeholder='Phone Number' 
                                    required  
                                    onChange={(e)=>setPhone(e.target.value)} 
                                    value={phone} 
                                    aria-label='Phone' 
                                />
                            </div>
                        )}

                        <div className='relative'>
                              <input id='login-password' name='password' type={show?"text":"password"} autoComplete='current-password' className='w-full h-[48px] border-[2px] border-[#b8dce8] rounded-lg bg-[#f5f9fc] placeholder-[#5a8899] px-4 font-semibold text-[#0a5f7a] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all' placeholder='Password' required onChange={(e)=>setPassword(e.target.value)} value={password} aria-label='Password' />
                            <div className='absolute right-3 top-3 text-[#1488aa] cursor-pointer' onClick={()=>setShow(prev => !prev)}>{show? <IoEye/> : <IoEyeOutline/>}</div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className='text-right -mt-2'>
                            <span className='text-[#1488aa] text-[13px] font-semibold cursor-pointer hover:underline' onClick={()=>navigate("/forgot-password")}>
                                Forgot Password?
                            </span>
                        </div>

                        <button className='w-full h-[48px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] rounded-lg flex items-center justify-center text-[17px] font-semibold text-white hover:shadow-[0_0_20px_rgba(20,136,170,0.3)] transition-all'>{loading? <Loading/> : "Login"}</button>

                        <p className='text-center text-[#3a5a65] mt-2 font-medium'>Don’t have an account? <span className='text-[#1488aa] font-bold cursor-pointer hover:underline' onClick={()=>navigate("/signup")}>Create one</span></p>
                    </form>
                </motion.div>

            </div>
        </div>
    )
}

export default Login
