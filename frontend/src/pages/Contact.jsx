import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa'
import Title from '../component/Title'
import NewLetterBox from '../component/NewLetterBox'
import Footer from '../component/Footer'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setSubmitted(false)
    }, 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <div className='w-[99vw] min-h-[100vh] bg-gradient-to-br from-[#e8f4f8] via-[#f5f9fc] to-[#e0eff5]'>
      {/* Header Section */}
      <div className='pt-[80px] pb-[60px]'>
        <Title text1={'GET IN'} text2={'TOUCH'} />
      </div>

      {/* Main Content */}
      <div className='w-[100%] px-[20px] lg:px-[60px] pb-[60px]'>
        <motion.div 
          className='grid grid-cols-1 lg:grid-cols-3 gap-[30px] mb-[80px]'
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Info Cards */}
          
          {/* Phone Card */}
          <motion.div 
            variants={itemVariants}
            className='bg-white p-[30px] rounded-[15px] border-2 border-[#b8dce8] hover:border-[#1488aa] transition-all duration-300 group shadow-md'
            whileHover={{ y: -10, boxShadow: '0 0 30px rgba(20, 136, 170, 0.2)' }}
          >
            <div className='flex items-center gap-[15px] mb-[20px]'>
              <div className='w-[50px] h-[50px] rounded-[12px] bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] flex items-center justify-center group-hover:scale-110 transition-transform'>
                <FaPhone className='text-white text-[24px]' />
              </div>
              <h3 className='text-[20px] font-bold text-[#0a5f7a]'>Phone</h3>
            </div>
            <p className='text-[#1488aa] text-[17px] font-bold'>+91 7041827656</p>
            <p className='text-[#3a5a65] text-[15px] mt-[8px] font-medium'>Available 24/7</p>
          </motion.div>

          {/* Email Card */}
          <motion.div 
            variants={itemVariants}
            className='bg-white p-[30px] rounded-[15px] border-2 border-[#b8dce8] hover:border-[#1488aa] transition-all duration-300 group shadow-md'
            whileHover={{ y: -10, boxShadow: '0 0 30px rgba(20, 136, 170, 0.2)' }}
          >
            <div className='flex items-center gap-[15px] mb-[20px]'>
              <div className='w-[50px] h-[50px] rounded-[12px] bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] flex items-center justify-center group-hover:scale-110 transition-transform'>
                <FaEnvelope className='text-white text-[24px]' />
              </div>
              <h3 className='text-[20px] font-bold text-[#0a5f7a]'>Email</h3>
            </div>
            <p className='text-[#1488aa] text-[17px] font-bold break-all'>support@onecart.com</p>
            <p className='text-[#3a5a65] text-[15px] mt-[8px] font-medium'>We reply within 24 hours</p>
          </motion.div>

          {/* Location Card */}
          <motion.div 
            variants={itemVariants}
            className='bg-white p-[30px] rounded-[15px] border-2 border-[#b8dce8] hover:border-[#1488aa] transition-all duration-300 group shadow-md'
            whileHover={{ y: -10, boxShadow: '0 0 30px rgba(20, 136, 170, 0.2)' }}
          >
            <div className='flex items-center gap-[15px] mb-[20px]'>
              <div className='w-[50px] h-[50px] rounded-[12px] bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] flex items-center justify-center group-hover:scale-110 transition-transform'>
                <FaMapMarkerAlt className='text-white text-[24px]' />
              </div>
              <h3 className='text-[20px] font-bold text-[#0a5f7a]'>Location</h3>
            </div>
            <p className='text-[#1488aa] text-[17px] font-bold'>Varanasi, UP</p>
            <p className='text-[#3a5a65] text-[15px] mt-[8px] font-medium'>India</p>
          </motion.div>
        </motion.div>

        {/* Form & Address Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-[50px] mb-[80px]'>
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='bg-white p-[40px] rounded-[20px] border-2 border-[#b8dce8] shadow-lg'
          >
            <h2 className='text-[28px] font-bold mb-[10px]'>
              <span className='bg-gradient-to-r from-[#0a5f7a] to-[#1488aa] bg-clip-text text-transparent'>Send us a</span>
              <span className='text-[#0a5f7a]'> Message</span>
            </h2>
            <p className='text-[#3a5a65] text-[15px] mb-[30px] font-medium'>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

            <form onSubmit={handleSubmit} className='flex flex-col gap-[20px]'>
              {/* Name Input */}
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className='relative'
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className='w-[100%] px-[16px] py-[14px] bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-[10px] text-[#0a5f7a] placeholder-[#5a8899] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all'
                />
              </motion.div>

              {/* Email Input */}
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className='relative'
              >
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className='w-[100%] px-[16px] py-[14px] bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-[10px] text-[#0a5f7a] placeholder-[#5a8899] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all'
                />
              </motion.div>

              {/* Phone Input */}
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className='relative'
              >
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className='w-[100%] px-[16px] py-[14px] bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-[10px] text-[#0a5f7a] placeholder-[#5a8899] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all'
                />
              </motion.div>

              {/* Subject Input */}
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className='relative'
              >
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className='w-[100%] px-[16px] py-[14px] bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-[10px] text-[#0a5f7a] placeholder-[#5a8899] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all'
                />
              </motion.div>

              {/* Message Textarea */}
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className='relative'
              >
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows="5"
                  className='w-[100%] px-[16px] py-[14px] bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-[10px] text-[#0a5f7a] placeholder-[#5a8899] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all resize-none'
                ></textarea>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='w-[100%] mt-[10px] px-[30px] py-[14px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white font-bold text-[17px] rounded-[10px] flex items-center justify-center gap-[10px] hover:shadow-[0_0_30px_rgba(20,136,170,0.4)] transition-all'
              >
                <FaPaperPlane className='text-[18px]' />
                {submitted ? 'Message Sent!' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>

          {/* Address & Map Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='flex flex-col gap-[30px]'
          >
            {/* Address Card */}
            <div className='bg-white p-[40px] rounded-[20px] border-2 border-[#b8dce8] shadow-lg'>
              <h2 className='text-[28px] font-bold mb-[10px]'>
                <span className='bg-gradient-to-r from-[#0a5f7a] to-[#1488aa] bg-clip-text text-transparent'>Our</span>
                <span className='text-[#0a5f7a]'> Address</span>
              </h2>
              <p className='text-[#3a5a65] text-[15px] mb-[30px] font-medium'>Visit us at our headquarters</p>

              <div className='space-y-[25px]'>
                {/* Address Details */}
                <div className='flex gap-[15px]'>
                  <FaMapMarkerAlt className='text-[#1488aa] text-[20px] mt-[5px] flex-shrink-0' />
                  <div>
                    <p className='text-[#0a5f7a] font-bold text-[17px] mb-[5px]'>Address</p>
                    <p className='text-[#3a5a65] text-[15px] leading-relaxed font-medium'>S. 13/4-4-5-4 1st Floor, Near Teliyabagh Chauraha, Teliyabagh, Teliyabagh, Varanasi-221002, Uttar Pradesh</p>
                  </div>
                </div>

                {/* Phone Details */}
                <div className='flex gap-[15px]'>
                  <FaPhone className='text-[#1488aa] text-[20px] mt-[5px] flex-shrink-0' />
                  <div>
                    <p className='text-[#0a5f7a] font-bold text-[17px] mb-[5px]'>Phone</p>
                    <p className='text-[#3a5a65] text-[15px] font-medium'>+91 7041827656</p>
                  </div>
                </div>

                {/* Email Details */}
                <div className='flex gap-[15px]'>
                  <FaEnvelope className='text-[#1488aa] text-[20px] mt-[5px] flex-shrink-0' />
                  <div>
                    <p className='text-[#0a5f7a] font-bold text-[17px] mb-[5px]'>Email</p>
                    <p className='text-[#3a5a65] text-[15px] font-medium'>support@onecart.com</p>
                  </div>
                </div>

                {/* Hours Details */}
                <div className='flex gap-[15px]'>
                  <FaClock className='text-[#1488aa] text-[20px] mt-[5px] flex-shrink-0' />
                  <div>
                    <p className='text-[#0a5f7a] font-bold text-[17px] mb-[5px]'>Business Hours</p>
                    <p className='text-[#3a5a65] text-[15px] font-medium'>Monday - Sunday: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <motion.div
              whileHover={{ boxShadow: '0 0 40px rgba(20, 136, 170, 0.3)' }}
              className='rounded-[20px] overflow-hidden border-2 border-[#b8dce8] h-[300px] lg:h-[400px] shadow-lg'
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.445980851841!2d82.995!3d25.315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e3b3e3b3b3b3b%3A0x0!2sVaranasi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <NewLetterBox />
      <Footer />
    </div>
  )
}

export default Contact
