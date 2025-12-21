import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { MdShoppingCart } from 'react-icons/md'
import { FaArrowRight } from 'react-icons/fa'

function Card({name , image , id , price}) {
    let {currency} = useContext(shopDataContext)
    let navigate = useNavigate()
  return (
    <motion.div 
      className='group w-[300px] max-w-[90%] h-[420px] bg-white backdrop-blur-lg rounded-2xl flex items-start justify-start flex-col overflow-hidden cursor-pointer border-[1px] border-[#b8dce8] shadow-md hover:shadow-[0_0_30px_rgba(20,136,170,0.3)] transition-all duration-300' 
      onClick={()=>navigate(`/productdetail/${id}`)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -8,
        borderColor: 'rgba(20, 136, 170, 0.8)',
      }}
      whileTap={{ scale: 0.98 }}
    >
        {/* Image Container */}
        <div className='relative w-full h-[70%] overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#e0eff5] to-[#f5f9fc]'>
          <motion.img 
            src={image} 
            alt={name} 
            className='w-full h-full object-cover'
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Gradient Overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        </div>

        {/* Divider Line */}
        <div className='w-full h-[2px] bg-gradient-to-r from-transparent via-[#1488aa]/40 to-transparent' />

        {/* Content Section */}
        <div className='w-full px-4 py-4 flex flex-col gap-2'>
          {/* Product Name */}
          <motion.h3 
            className='text-[#0a5f7a] text-[17px] font-semibold line-clamp-2 min-h-[48px] group-hover:text-[#1488aa] transition-colors duration-300'
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
          >
            {name}
          </motion.h3>
          
          {/* Price and Cart Section */}
          <motion.div 
            className='flex items-center justify-between'
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ delay: 0.3 }}
          >
            <div className='flex flex-col'>
              <span className='text-[#5a8899] text-[12px] font-light'>Price</span>
              <span className='text-[#1488aa] text-[20px] font-bold'>
                {currency} {price}
              </span>
            </div>
            
            <motion.div 
              className='bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] p-2.5 rounded-full shadow-md group-hover:shadow-[0_0_20px_rgba(20,136,170,0.5)]'
              whileHover={{ scale: 1.15, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
            >
              <MdShoppingCart className='text-white text-[20px]' />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom Accent Line */}
        <div className='absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[#1488aa] via-[#2d8a4d] to-[#1488aa] group-hover:w-full transition-all duration-500' />
    </motion.div>
  )
}

export default Card
