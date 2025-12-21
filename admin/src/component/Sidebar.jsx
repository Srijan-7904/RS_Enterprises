import React from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegListAlt } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { MdImage, MdChat } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    let navigate = useNavigate()
  return (
    <div className='w-[18%] min-h-[100vh] border-r-2 border-[#b8dce8] py-[60px] fixed left-0 top-0 bg-white shadow-sm'>
        <div className='flex flex-col gap-4 pt-[40px] pl-[20%] text-[15px]'>

            <div className='flex items-center justify-center md:justify-start gap-3 border-2 border-[#b8dce8] hover:border-[#1488aa] border-r-0 px-3 py-2 cursor-pointer hover:bg-[#e8f4f8] transition-all rounded-l-lg font-semibold text-[#0a5f7a]' onClick={()=>navigate('/add')}>
                <IoIosAddCircleOutline className='w-[20px] h-[20px]'/>
                <p className='hidden md:block'>Add Items</p>

            </div>
            <div className='flex items-center justify-center md:justify-start gap-3 border-2 border-[#b8dce8] hover:border-[#1488aa] border-r-0 px-3 py-2 cursor-pointer hover:bg-[#e8f4f8] transition-all rounded-l-lg font-semibold text-[#0a5f7a]' onClick={()=>navigate('/image-generator')}>
                <MdImage className='w-[20px] h-[20px]'/>
                <p className='hidden md:block'>Image Generator</p>

            </div>
               <div className='flex items-center justify-center md:justify-start gap-3 border-2 border-[#b8dce8] hover:border-[#1488aa] border-r-0 px-3 py-2 cursor-pointer hover:bg-[#e8f4f8] transition-all rounded-l-lg font-semibold text-[#0a5f7a]' onClick={()=>navigate('/lists')}>
                <FaRegListAlt className='w-[20px] h-[20px]'/>
                <p className='hidden md:block'>List Items</p>

            </div>
               <div className='flex items-center justify-center md:justify-start gap-3 border-2 border-[#b8dce8] hover:border-[#1488aa] border-r-0 px-3 py-2 cursor-pointer hover:bg-[#e8f4f8] transition-all rounded-l-lg font-semibold text-[#0a5f7a]' onClick={()=>navigate('/orders')}>
                <SiTicktick className='w-[20px] h-[20px]'/>
                <p className='hidden md:block'>View Orders</p>

            </div>
        </div>
      
    </div>
  )
}

export default Sidebar
