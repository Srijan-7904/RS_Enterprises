import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Features() {
  const featuresRef = useRef([])

  useEffect(() => {
    featuresRef.current.forEach((feature, index) => {
      gsap.fromTo(feature,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.15,
          scrollTrigger: {
            trigger: feature,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      )
    })
  }, [])

  const features = [
    { icon: '🚚', title: 'Fast Shipping', desc: 'Delivery within 2-3 business days' },
    { icon: '🔒', title: 'Secure Payment', desc: 'Multiple payment options & secure checkout' },
    { icon: '↩️', title: 'Easy Returns', desc: '30-day return guarantee no questions asked' },
    { icon: '💬', title: '24/7 Support', desc: 'Expert customer service always available' },
    { icon: '✅', title: 'Authentic', desc: '100% genuine products guaranteed' },
    { icon: '🎁', title: 'Special Offers', desc: 'Exclusive deals and discounts daily' }
  ]

  return (
    <motion.div 
      className='w-[100%] h-auto py-[60px] bg-gradient-to-r from-[#d4e9f2] via-[#e0eff5] to-[#d4e9f2]'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className='max-w-[1200px] mx-auto px-[20px]'>
        <motion.h2 
          className='text-[40px] md:text-[50px] font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#0a5f7a] to-[#1488aa] mb-[50px]'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why Choose RS Enterprises
        </motion.h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]'>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              ref={el => featuresRef.current[idx] = el}
              className='bg-white border border-[#b8dce8] rounded-xl p-8 text-center hover:border-[#1488aa] shadow-md'
              whileHover={{ 
                boxShadow: '0 20px 50px rgba(20, 136, 170, 0.2)',
                borderColor: '#1488aa'
              }}
            >
              <div className='text-[50px] mb-4'>{feature.icon}</div>
              <h3 className='text-[20px] font-bold text-[#1488aa] mb-2'>{feature.title}</h3>
              <p className='text-[14px] text-[#2c5f6f]'>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Features
