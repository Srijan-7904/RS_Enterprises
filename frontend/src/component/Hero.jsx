import React from 'react'
import { motion } from 'framer-motion'
import { FaCircle } from "react-icons/fa";

function Hero({heroData,heroCount,setHeroCount}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div className='w-[40%] h-[100%]  relative' >
        <motion.div 
          className='absolute  text-[#0a5f7a]  text-[20px] md:text-[40px] lg:text-[55px] md:left-[10%] md:top-[90px] lg:top-[130px] left-[10%] top-[10px]'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
            <motion.p variants={textVariants}>{heroData.text1}</motion.p>
            <motion.p variants={textVariants}>{heroData.text2}</motion.p>
        </motion.div>
        <motion.div 
          className='absolute md:top-[400px]   lg:top-[500px] top-[160px] left-[10%] flex items-center justify-center gap-[10px] '
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaCircle className={`w-[14px] cursor-pointer ${heroCount=== 0 ?"fill-orange-500":"fill-gray-700"}`} onClick={()=>setHeroCount(0)}/>
        </motion.div>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaCircle className={`w-[14px] cursor-pointer ${heroCount=== 1 ?"fill-orange-500":"fill-gray-700"}`} onClick={()=>setHeroCount(1)}/>
        </motion.div>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaCircle className={`w-[14px] cursor-pointer ${heroCount=== 2 ?"fill-orange-500":"fill-gray-700"}`} onClick={()=>setHeroCount(2)}/>
        </motion.div>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaCircle className={`w-[14px] cursor-pointer ${heroCount=== 3 ?"fill-orange-500":"fill-gray-700"}`} onClick={()=>setHeroCount(3)}/>
        </motion.div>
        </motion.div>
      
    </div>
  )
}

export default Hero
