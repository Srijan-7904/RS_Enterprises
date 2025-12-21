import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function BestSeller() {
    let {products} = useContext(shopDataContext)
    let [bestSeller,setBestSeller] = useState([])

    useEffect(()=>{
    let filterProduct = products.filter((item) => item.bestseller)

    setBestSeller(filterProduct.slice(0,4));
    },[products])

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
      },
    };

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
        <motion.div className='h-[8%] w-[100%] text-center mt-[50px] '>
            <Title text1={"BEST"} text2={"SELLER"}/> 
            <motion.p 
              className='w-[100%] m-auto text-[15px] md:text-[22px] px-[10px] text-[#0a3d4a] font-bold'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Tried, Tested, Loved – Discover Our All-Time Best Sellers.
            </motion.p>
        </motion.div>
        <motion.div className='w-[100%] h-[50%] mt-[30px] flex items-center justify-center flex-wrap gap-[50px]'>
            {
             bestSeller.map((item,index)=>(
                <motion.div key={index} variants={containerVariants}>
                  <Card name={item.name} id={item._id} price={item.price} image={item.image1}/>
                </motion.div>
             ))
            }
        </motion.div>
      
    </motion.div>
  )
}

export default BestSeller
