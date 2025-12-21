import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

function NewLetterBox() {
  const boxRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    if (boxRef.current) {
      gsap.fromTo(boxRef.current,
        { opacity: 0, scale: 0.9, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: 'back.out',
          scrollTrigger: {
            trigger: boxRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      )
    }

    if (textRef.current) {
      gsap.fromTo(textRef.current.querySelectorAll('p'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      )
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <motion.div 
      ref={boxRef}
      className='w-[100%] md:h-[40vh] h-[50vh] bg-gradient-to-r from-[#d4e9f2] via-[#c8e4f0] to-[#d4e9f2] flex items-center justify-center flex-col gap-[20px] p-[20px]'
      whileInView={{ scale: [0.95, 1.02, 1] }}
      transition={{ duration: 0.6 }}
    >
      <div ref={textRef} className='flex items-center justify-center flex-col gap-[10px]'>
        <p className='text-[30px] md:text-[45px] font-bold text-[#0a5f7a]'>Subscribe now & get 20% off</p>
        <p className='text-[14px] md:text-[18px] text-[#2c5f6f] text-center max-w-[600px]'>
          Subscribe now and enjoy exclusive savings, special deals, and early access to new collections.
        </p>
      </div>
      
      <motion.form 
        onSubmit={handleSubmit}
        className='flex items-center justify-center gap-[10px] w-[100%] max-w-[500px]'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.input 
          type="email" 
          placeholder='Enter your email' 
          className='px-[15px] py-[12px] w-[70%] rounded-lg bg-white border-2 border-[#1488aa] text-gray-800 placeholder-[#5a8899] focus:outline-none focus:border-[#0a5f7a] shadow-sm'
          whileFocus={{ scale: 1.02 }}
          required
        />
        <motion.button 
          type='submit'
          className='px-[25px] py-[12px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#1488aa]/50'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Subscribe
        </motion.button>
      </motion.form>

      <motion.p 
        className='text-[12px] text-[#5a8899] text-center'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        We respect your privacy. Unsubscribe at any time.
      </motion.p>
    </motion.div>
  )
}

export default NewLetterBox
