import React from 'react'
import { motion } from 'framer-motion'
import logo from "../assets/logo.png"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa'

function Footer() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' }
  ];

  return (
    <div className='w-[100%]'>
      {/* Main Footer */}
      <motion.div 
        className='w-[100%] bg-gradient-to-b from-[#d4e9f2] to-[#c8e4f0] border-t border-[#1488aa]/30 pt-[60px] pb-[80px] md:pb-[60px] px-[20px] lg:px-[60px]'
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px] max-w-[1400px] mx-auto'>

          {/* Brand Section */}
          <motion.div variants={itemVariants} className='flex flex-col gap-[20px]'>
            <div className='flex items-center gap-[12px]'>
              <img src={logo} alt="logo" className='w-[45px] h-[45px]' />
              <h3 className='text-[24px] font-bold bg-gradient-to-r from-[#0a5f7a] via-[#1488aa] to-[#0a5f7a] bg-clip-text text-transparent'>RS ENTERPRISES</h3>
            </div>
            <p className='text-[#3a5a65] text-[14px] leading-relaxed'>
              Your all-in-one online shopping destination, offering top-quality products, unbeatable deals, and fast delivery—all backed by trusted service.
            </p>
            <div className='flex items-center gap-[12px] mt-[15px]'>
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  title={social.label}
                  whileHover={{ scale: 1.2, color: '#0a5f7a' }}
                  whileTap={{ scale: 0.95 }}
                  className='w-[40px] h-[40px] rounded-[50%] bg-white border-2 border-[#1488aa]/50 flex items-center justify-center text-[#1488aa] hover:border-[#0a5f7a] transition-all text-[18px] shadow-sm'
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className='flex flex-col gap-[20px]'>
            <h4 className='text-[20px] font-bold text-[#0a5f7a] flex items-center gap-[8px]'>
              📌 Quick Links
            </h4>
            <ul className='flex flex-col gap-[12px]'>
              {['Home', 'Collections', 'About Us', 'Contact Us'].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 8 }}
                  className='text-[#3a5a65] hover:text-[#1488aa] cursor-pointer transition-colors flex items-center gap-[8px] group'
                >
                  <FaArrowRight className='text-[#1488aa] opacity-0 group-hover:opacity-100 transition-opacity text-[12px]' />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Policies */}
          <motion.div variants={itemVariants} className='flex flex-col gap-[20px]'>
            <h4 className='text-[20px] font-bold text-[#0a5f7a] flex items-center gap-[8px]'>
              ⚖️ Policies
            </h4>
            <ul className='flex flex-col gap-[12px]'>
              {['Privacy Policy', 'Terms & Conditions', 'Return Policy', 'FAQ'].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 8 }}
                  className='text-[#3a5a65] hover:text-[#1488aa] cursor-pointer transition-colors flex items-center gap-[8px] group'
                >
                  <FaArrowRight className='text-[#1488aa] opacity-0 group-hover:opacity-100 transition-opacity text-[12px]' />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className='flex flex-col gap-[20px]'>
            <h4 className='text-[20px] font-bold text-[#0a5f7a] flex items-center gap-[8px]'>
              📞 Contact Us
            </h4>
            <div className='flex flex-col gap-[15px]'>
              {/* Phone */}
              <motion.div
                whileHover={{ x: 5 }}
                className='flex items-start gap-[12px] group'
              >
                <FaPhone className='text-[#1488aa] mt-[4px] flex-shrink-0 text-[16px]' />
                <div>
                  <p className='text-[#5a8899] text-[12px]'>Phone</p>
                  <a href="tel:+917041827656" className='text-[#3a5a65] hover:text-[#1488aa] transition-colors text-[14px] font-semibold'>
                    +91 7041827656
                  </a>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                whileHover={{ x: 5 }}
                className='flex items-start gap-[12px] group'
              >
                <FaEnvelope className='text-[#1488aa] mt-[4px] flex-shrink-0 text-[16px]' />
                <div>
                  <p className='text-[#5a8899] text-[12px]'>Email</p>
                  <a href="mailto:support@onecart.com" className='text-[#3a5a65] hover:text-[#1488aa] transition-colors text-[14px] font-semibold break-all'>
                    support@onecart.com
                  </a>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                whileHover={{ x: 5 }}
                className='flex items-start gap-[12px] group'
              >
                <FaMapMarkerAlt className='text-[#1488aa] mt-[4px] flex-shrink-0 text-[16px]' />
                <div>
                  <p className='text-[#5a8899] text-[12px]'>Location</p>
                  <p className='text-[#3a5a65] text-[14px]'>Varanasi, UP, India</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>

      </motion.div>

      {/* Divider */}
      <div className='w-[100%] h-[1px] bg-gradient-to-r from-transparent via-[#1488aa]/40 to-transparent'></div>

      {/* Copyright Section */}
      <motion.div
        className='w-[100%] bg-gradient-to-r from-[#c8e4f0] to-[#b8dce8] py-[25px] px-[20px] lg:px-[60px]'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
      >
        <div className='max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-[15px] text-center md:text-left'>
          <p className='text-[#3a5a65] text-[13px]'>
            © 2025 RS Enterprises. All Rights Reserved.
          </p>
          <div className='flex items-center gap-[20px] text-[13px]'>
            <motion.a href="#" whileHover={{ color: '#0a5f7a' }} className='text-[#3a5a65] hover:text-[#0a5f7a] transition-colors'>
              Security
            </motion.a>
            <div className='w-[1px] h-[16px] bg-[#1488aa]/40'></div>
            <motion.a href="#" whileHover={{ color: '#0a5f7a' }} className='text-[#3a5a65] hover:text-[#0a5f7a] transition-colors'>
              Accessibility
            </motion.a>
            <div className='w-[1px] h-[16px] bg-[#1488aa]/40'></div>
            <motion.a href="#" whileHover={{ color: '#0a5f7a' }} className='text-[#3a5a65] hover:text-[#0a5f7a] transition-colors'>
              Sitemap
            </motion.a>
          </div>
        </div>
      </motion.div>

    </div>
  )
}

export default Footer
