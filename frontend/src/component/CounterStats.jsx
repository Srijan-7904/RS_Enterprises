import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

function CounterStats() {
  const countersRef = useRef([])

  useEffect(() => {
    countersRef.current.forEach((counter, index) => {
      const finalValue = parseInt(counter.getAttribute('data-value'))
      gsap.to(counter, {
        textContent: finalValue,
        duration: 2.5,
        ease: 'power2.out',
        delay: index * 0.2,
        snap: { textContent: 1 },
        onUpdate: function() {
          counter.textContent = Math.floor(parseInt(counter.textContent))
        }
      })
    })
  }, [])

  return (
    <motion.div 
      className='w-[100%] min-h-[50vh] sm:min-h-[60vh] md:h-[70vh] bg-gradient-to-r from-[#e8f4f8] via-[#f5f9fc] to-[#e8f4f8] flex items-center justify-center py-[40px] sm:py-[50px] md:py-0'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px] sm:gap-[35px] md:gap-[40px] px-[15px] sm:px-[20px] w-full max-w-[1200px]'>
        <motion.div 
          className='text-center flex flex-col items-center gap-2 sm:gap-3'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0 }}
        >
          <p className='text-[40px] sm:text-[50px] md:text-[60px] font-bold text-[#1488aa]' ref={el => countersRef.current[0] = el} data-value='15000'>0</p>
          <p className='text-[16px] sm:text-[17px] md:text-[18px] text-[#0a5f7a] font-semibold'>Happy Customers</p>
          <p className='text-[12px] sm:text-[13px] md:text-[14px] text-[#2c5f6f]'>Trusted worldwide</p>
        </motion.div>

        <motion.div 
          className='text-center flex flex-col items-center gap-2 sm:gap-3'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className='text-[40px] sm:text-[50px] md:text-[60px] font-bold text-[#2d8a4d]' ref={el => countersRef.current[1] = el} data-value='50000'>0</p>
          <p className='text-[16px] sm:text-[17px] md:text-[18px] text-[#0a5f7a] font-semibold'>Total Sales</p>
          <p className='text-[12px] sm:text-[13px] md:text-[14px] text-[#2c5f6f]'>₹ in revenue</p>
        </motion.div>

        <motion.div 
          className='text-center flex flex-col items-center gap-2 sm:gap-3'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className='text-[40px] sm:text-[50px] md:text-[60px] font-bold text-[#c99803]' ref={el => countersRef.current[2] = el} data-value='1200'>0</p>
          <p className='text-[16px] sm:text-[17px] md:text-[18px] text-[#0a5f7a] font-semibold'>Products</p>
          <p className='text-[12px] sm:text-[13px] md:text-[14px] text-[#2c5f6f]'>Premium quality</p>
        </motion.div>

        <motion.div 
          className='text-center flex flex-col items-center gap-2 sm:gap-3'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className='text-[40px] sm:text-[50px] md:text-[60px] font-bold text-[#c93629]' ref={el => countersRef.current[3] = el} data-value='48'>0</p>
          <p className='text-[16px] sm:text-[17px] md:text-[18px] text-[#0a5f7a] font-semibold'>Countries</p>
          <p className='text-[12px] sm:text-[13px] md:text-[14px] text-[#2c5f6f]'>Global delivery</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default CounterStats
