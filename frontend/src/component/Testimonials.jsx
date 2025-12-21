import React from 'react'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'

function Testimonials() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Photography Professional',
      text: 'Exceptional camera quality and unbeatable prices. The delivery was fast and customer service was stellar!',
      image: 'https://i.pravatar.cc/150?img=1',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Content Creator',
      text: 'Best online store for camera equipment. The product range is amazing and the website is so easy to navigate.',
      image: 'https://i.pravatar.cc/150?img=2',
      rating: 5
    },
    {
      name: 'Ahmed Hassan',
      role: 'Film Maker',
      text: 'RS Enterprises has everything I need. Great prices, authentic products, and reliable shipping to my location.',
      image: 'https://i.pravatar.cc/150?img=3',
      rating: 5
    },
    {
      name: 'Lisa Chen',
      role: 'Tech Blogger',
      text: 'Absolutely love this store! Products are genuine, customer support is helpful, and returns are hassle-free.',
      image: 'https://i.pravatar.cc/150?img=4',
      rating: 5
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.div 
      className='w-[100%] h-auto py-[60px] bg-gradient-to-l from-[#e0eff5] to-[#d4e9f2]'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className='max-w-[1200px] mx-auto px-[20px]'>
        <motion.div className='text-center mb-[50px]' variants={itemVariants}>
          <h2 className='text-[40px] md:text-[50px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0a5f7a] to-[#1488aa] mb-3'>
            Customer Love
          </h2>
          <p className='text-[16px] text-[#2c5f6f]'>Join thousands of satisfied customers worldwide</p>
        </motion.div>

        <motion.div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]' variants={containerVariants}>
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className='bg-white border border-[#b8dce8] rounded-xl p-6 hover:border-[#1488aa] shadow-md'
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(20, 136, 170, 0.2)' }}
            >
              <div className='flex gap-1 mb-4'>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className='text-[#fbbc04] text-[14px]' />
                ))}
              </div>

              <p className='text-[#2c5f6f] text-[14px] mb-4 leading-relaxed'>{testimonial.text}</p>

              <div className='flex items-center gap-3 border-t border-[#b8dce8] pt-4'>
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className='w-[40px] h-[40px] rounded-full'
                />
                <div>
                  <p className='text-[#1488aa] font-semibold text-[14px]'>{testimonial.name}</p>
                  <p className='text-[#5a8899] text-[12px]'>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Testimonials
