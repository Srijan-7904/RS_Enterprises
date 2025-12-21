import React from 'react'
import { motion } from 'framer-motion'

function Title({text1 ,text2}) {
  return (
    <motion.div 
      className='mb-3'
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
        <div className='inline-block bg-white/5 border border-white/20 rounded-md px-4 py-2'>
        <motion.p 
          className='text-[#0a5f7a] text-[35px] md:text-[40px] inline-block font-bold'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {text1} <motion.span 
            className='text-[#1488aa]'
            initial={{ opacity: 0, color: '#0a5f7a' }}
            whileInView={{ opacity: 1, color: '#1488aa' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {text2}
          </motion.span>
        </motion.p>
        </div>
      
    </motion.div>
  )
}

export default Title
