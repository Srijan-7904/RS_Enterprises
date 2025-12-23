import React from 'react'
import { motion } from 'framer-motion'
import Title from '../component/Title'
import about from '../assets/about.png'
import NewLetterBox from '../component/NewLetterBox'
import Footer from '../component/Footer'
import { FaShieldAlt, FaTruck, FaHeadset, FaAward, FaUsers, FaChartLine } from 'react-icons/fa'
import { MdVerified } from 'react-icons/md'

function About() {
  const features = [
    {
      icon: <FaShieldAlt className='text-[40px]' />,
      title: 'Quality Assurance',
      desc: 'We guarantee quality through strict checks, reliable sourcing, and a commitment to customer satisfaction always.',
      gradient: 'from-[#65d8f7] to-[#00d4ff]'
    },
    {
      icon: <FaTruck className='text-[40px]' />,
      title: 'Convenience',
      desc: 'Shop easily with fast delivery, simple navigation, secure checkout, and everything you need in one place.',
      gradient: 'from-[#00d4ff] to-[#65d8f7]'
    },
    {
      icon: <FaHeadset className='text-[40px]' />,
      title: 'Exceptional Customer Service',
      desc: 'Our dedicated support team ensures quick responses, helpful solutions, and a smooth shopping experience every time.',
      gradient: 'from-[#65d8f7] to-[#00d4ff]'
    }
  ]

  const stats = [
    { icon: <FaUsers />, number: '10,000+', label: 'Happy Customers' },
    { icon: <FaAward />, number: '500+', label: 'Products' },
    { icon: <FaChartLine />, number: '99%', label: 'Satisfaction Rate' },
    { icon: <MdVerified />, number: '24/7', label: 'Support' }
  ]

  return (
    <div className='w-[99vw] min-h-[100vh] flex items-center justify-center flex-col bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] pt-[100px] pb-[0px]'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title text1={'ABOUT'} text2={'US'}/>
      </motion.div>
      <div className='w-[100%] flex items-center justify-center flex-col lg:flex-row px-4 lg:px-12 gap-8 mt-[40px]'>
        <motion.div 
          className='lg:w-[50%] w-[100%] flex items-center justify-center'
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className='relative'>
            <motion.img 
              src={about} 
              alt="About RS Enterprises" 
              className='lg:w-[65%] w-[80%] shadow-[0_0_40px_rgba(101,216,247,0.3)] rounded-2xl mx-auto'
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className='absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#65d8f7]/20 to-[#00d4ff]/20 rounded-full blur-2xl' />
          </div>
        </motion.div>
        <div className='lg:w-[50%] w-[80%] flex items-start justify-center gap-[20px]  flex-col mt-[20px] lg:mt-[0px]'>
          <p className='lg:w-[80%] w-[100%] text-[#0a5f7a] md:text-[16px] text-[13px]'>
            RS Enterprises born for smart, seamless shopping—created to deliver quality products, trending styles, and everyday essentials in one place. With reliable service, fast delivery, and great value, RS Enterprises makes your online shopping experience simple, satisfying, and stress-free.
          </p>
          <p className='lg:w-[80%] w-[100%] text-[#0a5f7a] md:text-[16px] text-[13px]'>
             modern shoppers—combining style, convenience, and affordability. Whether it’s fashion, essentials, or trends, we bring everything you need to one trusted platform with fast delivery, easy returns, and a customer-first shopping experience you’ll love.
          </p>
          <p className='lg:w-[80%] w-[100%] text-[15px] text-[#0a5f7a] lg:text-[18px] mt-[10px] font-bold'>Our Mission</p>
          <p className='lg:w-[80%] w-[100%] text-[#0a5f7a] md:text-[16px] text-[13px]'>
            Our mission is to redefine online shopping by delivering quality, affordability, and convenience. RS Enterprises connects customers with trusted products and brands, offering a seamless, customer-focused experience that saves time, adds value, and fits every lifestyle and need.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        className='w-[90%] lg:w-[80%] grid grid-cols-2 lg:grid-cols-4 gap-6 mt-[60px]'
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className='bg-white border-2 border-[#b8dce8] rounded-xl p-6 text-center hover:border-[#1488aa] transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,136,170,0.2)] shadow-md'
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className='text-[#1488aa] text-[35px] mb-3 flex justify-center'>
              {stat.icon}
            </div>
            <div className='text-[#0a5f7a] text-[28px] font-bold mb-1'>{stat.number}</div>
            <div className='text-[#1a3d4a] text-[16px] font-bold'>{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className='w-[100%] flex items-center justify-center flex-col gap-[40px] mt-[60px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Title text1={'WHY'} text2={'CHOOSE US'}/>
        </motion.div>
        <div className='w-[90%] lg:w-[80%] grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className='group relative overflow-hidden h-[280px] border-2 border-[#b8dce8] flex items-center justify-center gap-[20px] flex-col px-[30px] py-[25px] backdrop-blur-md bg-white rounded-2xl hover:border-[#1488aa] transition-all duration-300 hover:shadow-[0_0_40px_rgba(20,136,170,0.3)] shadow-md'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <motion.div 
                className={`w-20 h-20 rounded-full bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] flex items-center justify-center text-white shadow-lg`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>

              <b className='text-[22px] font-bold text-center bg-gradient-to-r from-[#0a5f7a] to-[#1488aa] bg-clip-text text-transparent'>
                {feature.title}
              </b>

              <p className='text-[#0a3d4a] text-[17px] text-center leading-relaxed font-semibold'>
                {feature.desc}
              </p>

              <div className='absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#1488aa]/10 to-[#2d8a4d]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500' />
            </motion.div>
          ))}
        </div>
      </div>
      <div className='w-[100%] mt-[60px]'>
        <NewLetterBox/>
      </div>
      <Footer/>
    </div>
  )
}

export default About
