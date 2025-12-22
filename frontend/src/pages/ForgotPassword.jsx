import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import Logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { MdEmail } from "react-icons/md";
import { authDataContext } from '../context/authContext';
import axios from 'axios';
import Loading from '../component/Loading';
import { toast } from 'react-toastify';

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const { serverUrl } = useContext(authDataContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const result = await axios.post(serverUrl + '/api/auth/forgot-password', { email })
            console.log(result.data)
            setEmailSent(true)
            toast.success("Password reset email sent successfully!")
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error sending reset email")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] flex items-center justify-center p-4'>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='max-w-[500px] w-full bg-white rounded-2xl shadow-2xl border-2 border-[#b8dce8] overflow-hidden'
            >
                {/* Header */}
                <div className='bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] p-8 text-white'>
                    <img src={Logo} className='w-[56px] mb-4' alt='logo' />
                    <h2 className='text-3xl font-bold mb-2'>Forgot Password?</h2>
                    <p className='text-white/90'>No worries! Enter your email and we'll send you reset instructions.</p>
                </div>

                {/* Form */}
                <div className='p-8'>
                    {!emailSent ? (
                        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                            <div className='relative'>
                                <MdEmail className='absolute left-4 top-4 text-[#1488aa] text-[20px]' />
                                <input 
                                    autoFocus
                                    type="email" 
                                    className='w-full h-[52px] border-[2px] border-[#b8dce8] rounded-lg bg-[#f5f9fc] placeholder-[#5a8899] pl-12 pr-4 font-semibold text-[#0a5f7a] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all' 
                                    placeholder='Enter your email address' 
                                    required  
                                    onChange={(e)=>setEmail(e.target.value)} 
                                    value={email}
                                />
                            </div>

                            <button 
                                type='submit'
                                className='w-full h-[52px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] rounded-lg flex items-center justify-center text-[17px] font-semibold text-white hover:shadow-[0_0_20px_rgba(20,136,170,0.3)] transition-all'
                            >
                                {loading ? <Loading/> : "Send Reset Link"}
                            </button>

                            <div className='flex items-center justify-center gap-2 text-[#3a5a65] font-medium'>
                                <span>Remember your password?</span>
                                <span 
                                    className='text-[#1488aa] font-bold cursor-pointer hover:underline' 
                                    onClick={()=>navigate("/login")}
                                >
                                    Login
                                </span>
                            </div>
                        </form>
                    ) : (
                        <div className='flex flex-col items-center gap-5 text-center'>
                            <div className='w-[80px] h-[80px] bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] rounded-full flex items-center justify-center'>
                                <MdEmail className='text-white text-[40px]' />
                            </div>
                            <div>
                                <h3 className='text-[24px] font-bold text-[#0a5f7a] mb-2'>Check Your Email</h3>
                                <p className='text-[#5a8899] mb-4'>
                                    We've sent password reset instructions to<br/>
                                    <span className='font-semibold text-[#1488aa]'>{email}</span>
                                </p>
                                <p className='text-[14px] text-[#5a8899]'>
                                    Didn't receive the email? Check your spam folder or
                                    <span 
                                        className='text-[#1488aa] font-semibold cursor-pointer hover:underline ml-1'
                                        onClick={() => setEmailSent(false)}
                                    >
                                        try again
                                    </span>
                                </p>
                            </div>
                            <button 
                                className='w-full h-[52px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] rounded-lg text-[17px] font-semibold text-white hover:shadow-[0_0_20px_rgba(20,136,170,0.3)] transition-all'
                                onClick={()=>navigate("/login")}
                            >
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default ForgotPassword
