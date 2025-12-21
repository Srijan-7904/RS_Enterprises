import React from 'react'
import { motion } from 'framer-motion'
import Title from './Title'
import { RiExchangeFundsLine } from "react-icons/ri";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";

function OurPolicy() {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div 
      className='w-[100vw] h-[100vh] md:h-[70vh] flex items-center justify-start flex-col  bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] gap-[50px] '
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
    >
        <motion.div className='h-[8%] w-[100%] text-center mt-[70px] ' variants={cardVariants}>
            <Title text1={"OUR"} text2={"POLICY"}/>
            <motion.p className='w-[100%] m-auto text-[13px] md:text-[20px] px-[10px] text-[#0a5f7a] ' initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>Customer-Friendly Policies – Committed to Your Satisfaction and Safety.</motion.p>
        </motion.div>
      <motion.div className='w-[100%] md:min-h-[50%] h-[20%] flex items-center justify-center flex-wrap lg:gap-[50px] gap-[80px]' variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
        <motion.div className='w-[400px] max-w-[90%] h-[60%] flex items-center justify-center flex-col gap-[10px] ' variants={cardVariants} whileHover={{ scale: 1.05, y: -10 }}>
        <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
          <RiExchangeFundsLine  className='md:w-[60px] w-[30px] h-[30px] md:h-[60px] text-[#1488aa]'/>
        </motion.div>
        <p className='font-semibold md:text-[25px] text-[19px] text-[#0a5f7a]'>Easy Exchange Policy</p>
        <p className='font-semibold md:text-[18px] text-[12px] text-[#2c5f6f] text-center'>Exchange Made Easy – Quick, Simple, and Customer-Friendly Process.</p>
        </motion.div>

        <motion.div className='w-[400px] max-w-[90%] h-[60%] flex items-center justify-center flex-col gap-[10px] ' variants={cardVariants} whileHover={{ scale: 1.05, y: -10 }}>
        <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
          <TbRosetteDiscountCheckFilled  className='md:w-[60px] w-[30px] h-[30px] md:h-[60px] text-[#1488aa]'/>
        </motion.div>
        <p className='font-semibold md:text-[25px] text-[19px] text-[#0a5f7a]'>7 Days Return Policy</p>
        <p className='font-semibold md:text-[18px] text-[12px] text-[#2c5f6f] text-center'>Shop with Confidence – 7 Days Easy Return Guarantee.</p>
        </motion.div>

        <motion.div className='w-[400px] max-w-[90%] h-[60%] flex items-center justify-center flex-col gap-[10px] ' variants={cardVariants} whileHover={{ scale: 1.05, y: -10 }}>
        <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
          <BiSupport  className='md:w-[60px] w-[30px] h-[30px] md:h-[60px] text-[#1488aa]'/>
        </motion.div>
        <p className='font-semibold md:text-[25px] text-[19px] text-[#0a5f7a]'>Best Customer Support</p>
        <p className='font-semibold md:text-[18px] text-[12px] text-[#2c5f6f] text-center'>Trusted Customer Support – Your Satisfaction Is Our Priority.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default OurPolicy
