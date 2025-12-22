import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import Logo from "../assets/logo.png"
import { useNavigate, useParams } from 'react-router-dom'
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import { authDataContext } from '../context/authContext';
import axios from 'axios';
import Loading from '../component/Loading';
import { toast } from 'react-toastify';

function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)
    const { serverUrl } = useContext(authDataContext)
    const { token } = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if(newPassword !== confirmPassword){
            toast.error("Passwords do not match!")
            return
        }
        
        if(newPassword.length < 8){
            toast.error("Password must be at least 8 characters")
            return
        }
        
        setLoading(true)
        
        try {
            const result = await axios.post(serverUrl + '/api/auth/reset-password', { 
                token, 
                newPassword 
            })
            console.log(result.data)
            setResetSuccess(true)
            toast.success("Password reset successful!")
            setTimeout(() => {
                navigate("/login")
            }, 2000)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error resetting password")
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
                    <h2 className='text-3xl font-bold mb-2'>Reset Password</h2>
                    <p className='text-white/90'>Create a new password for your account.</p>
                </div>

                {/* Form */}
                <div className='p-8'>
                    {!resetSuccess ? (
                        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                            <div className='relative'>
                                <MdLock className='absolute left-4 top-4 text-[#1488aa] text-[20px]' />
                                <input 
                                    autoFocus
                                    type={showPassword ? "text" : "password"} 
                                    className='w-full h-[52px] border-[2px] border-[#b8dce8] rounded-lg bg-[#f5f9fc] placeholder-[#5a8899] pl-12 pr-12 font-semibold text-[#0a5f7a] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all' 
                                    placeholder='New Password' 
                                    required  
                                    onChange={(e)=>setNewPassword(e.target.value)} 
                                    value={newPassword}
                                />
                                <div 
                                    className='absolute right-4 top-4 text-[#1488aa] cursor-pointer text-[20px]' 
                                    onClick={()=>setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? <IoEye/> : <IoEyeOutline/>}
                                </div>
                            </div>

                            <div className='relative'>
                                <MdLock className='absolute left-4 top-4 text-[#1488aa] text-[20px]' />
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    className='w-full h-[52px] border-[2px] border-[#b8dce8] rounded-lg bg-[#f5f9fc] placeholder-[#5a8899] pl-12 pr-12 font-semibold text-[#0a5f7a] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all' 
                                    placeholder='Confirm New Password' 
                                    required  
                                    onChange={(e)=>setConfirmPassword(e.target.value)} 
                                    value={confirmPassword}
                                />
                                <div 
                                    className='absolute right-4 top-4 text-[#1488aa] cursor-pointer text-[20px]' 
                                    onClick={()=>setShowConfirmPassword(prev => !prev)}
                                >
                                    {showConfirmPassword ? <IoEye/> : <IoEyeOutline/>}
                                </div>
                            </div>

                            <div className='bg-[#e8f4f8] border-l-4 border-[#1488aa] p-3 rounded text-[13px] text-[#0a5f7a]'>
                                <p className='font-semibold mb-1'>Password Requirements:</p>
                                <ul className='list-disc list-inside space-y-1'>
                                    <li>At least 8 characters long</li>
                                    <li>Mix of letters and numbers recommended</li>
                                </ul>
                            </div>

                            <button 
                                type='submit'
                                className='w-full h-[52px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] rounded-lg flex items-center justify-center text-[17px] font-semibold text-white hover:shadow-[0_0_20px_rgba(20,136,170,0.3)] transition-all'
                            >
                                {loading ? <Loading/> : "Reset Password"}
                            </button>
                        </form>
                    ) : (
                        <div className='flex flex-col items-center gap-5 text-center'>
                            <div className='w-[80px] h-[80px] bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] rounded-full flex items-center justify-center'>
                                <span className='text-white text-[40px]'>✓</span>
                            </div>
                            <div>
                                <h3 className='text-[24px] font-bold text-[#0a5f7a] mb-2'>Password Reset Successfully!</h3>
                                <p className='text-[#5a8899] mb-4'>
                                    Your password has been updated. You can now login with your new password.
                                </p>
                            </div>
                            <button 
                                className='w-full h-[52px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] rounded-lg text-[17px] font-semibold text-white hover:shadow-[0_0_20px_rgba(20,136,170,0.3)] transition-all'
                                onClick={()=>navigate("/login")}
                            >
                                Go to Login
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default ResetPassword
