import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function LatestCollection() {
    let {products} = useContext(shopDataContext)
    let [latestProducts,setLatestProducts] = useState([])

    useEffect(()=>{
    setLatestProducts(products.slice(0,8));
    },[products])

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
      },
    };

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
      <motion.div className='h-[8%] w-[100%] text-center md:mt-[50px]  '>
        <Title text1={"LATEST"} text2={"COLLECTIONS"}/>
        <motion.p 
          className='w-[100%] m-auto text-[15px] md:text-[22px] px-[10px] text-[#0a3d4a] font-bold'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Step Into Style – New Collection Dropping This Season!
        </motion.p>
      </motion.div>
      <motion.div className='w-[100%] h-[50%] mt-[30px] flex items-center justify-center flex-wrap gap-[50px]'>
        {
            latestProducts.map((item,index)=>(
                <motion.div key={index} variants={containerVariants}>
                  <Card name={item.name} image={item.image1} id={item._id} price={item.price}/>
                </motion.div>
            ))
        }
        
        </motion.div>
    </motion.div>
  )
}

export default LatestCollection
