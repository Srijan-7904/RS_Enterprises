import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo.png"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

function Nav() {
    let navigate = useNavigate()
    let {serverUrl} = useContext(authDataContext)
    let {getAdmin} = useContext(adminDataContext)

    const logOut = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/logout", {withCredentials:true})
            console.log(result.data)
            toast.success("LogOut Successfully")
            getAdmin()
            navigate("/login")

        } catch (error) {
            console.log(error)
            toast.error("LogOut Failed")
        }
        
    }
  return (
    <div className='w-[100vw] h-[70px] bg-white border-b-2 border-[#b8dce8] z-10 fixed top-0 flex items-center justify-between px-[30px] overflow-x-hidden shadow-sm'>
        <div className='w-[30%]  flex items-center justify-start   gap-[6px] cursor-pointer ' onClick={()=>navigate("/")}> 
          <img src={logo} alt=""  className='w-[35px]'/>
          <h1 className='text-[20px] font-extrabold bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] bg-clip-text text-transparent'>RS ENTERPRISES</h1>
        </div>
        <button className='text-[15px] hover:shadow-md cursor-pointer bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] py-[10px] px-[20px] rounded-lg text-white font-bold transition-all' onClick={logOut}>LogOut</button>
    </div>
  )
}

export default Nav
