import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaCircle } from "react-icons/fa";

function Hero({heroData,heroCount,setHeroCount}) {
  const [displayText1, setDisplayText1] = useState('');
  const [displayText2, setDisplayText2] = useState('');
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  // All hero text data
  const allTexts = [
    {
      text1: "Get 30% OFF on Smart CCTV Systems Today",
      text2: "Secure What Matters Most to You"
    },
    {
      text1: "Advanced Surveillance Solutions for Your Property",
      text2: "Crystal Clear Video Quality Day & Night"
    },
    {
      text1: "Protect Your Home & Business with Confidence",
      text2: "24/7 Professional Monitoring Guaranteed"
    },
    {
      text1: "Next-Gen Cameras & Accessories Available Now",
      text2: "Your Safety Starts Here with Us"
    }
  ];

  useEffect(() => {
    setDisplayText1('');
    setDisplayText2('');
    setShowCursor1(true);
    setShowCursor2(false);

    const currentText = allTexts[textIndex];
    const text1 = currentText.text1;
    const text2 = currentText.text2;
    let index1 = 0;
    let index2 = 0;

    // Type first line
    const interval1 = setInterval(() => {
      if (index1 < text1.length) {
        setDisplayText1(text1.slice(0, index1 + 1));
        index1++;
      } else {
        clearInterval(interval1);
        setShowCursor1(false);
        setShowCursor2(true);
        
        // Start typing second line after first is complete
        const interval2 = setInterval(() => {
          if (index2 < text2.length) {
            setDisplayText2(text2.slice(0, index2 + 1));
            index2++;
          } else {
            clearInterval(interval2);
            setShowCursor2(false);
            
            // Wait 2 seconds then cycle to next text
            setTimeout(() => {
              setTextIndex((prev) => (prev + 1) % allTexts.length);
            }, 2000);
          }
        }, 50);
      }
    }, 50);

    return () => {
      clearInterval(interval1);
    };
  }, [textIndex]);

  return (
    <div className='w-full md:w-[60%] h-[100%] relative' >
        <div 
          className='absolute text-[#0a5f7a] text-[clamp(1rem,4vw,3.5rem)] left-[5%] md:left-[10%] top-[10px] sm:top-[30px] md:top-[70px] lg:top-[130px] font-bold w-[90%] md:w-[80%]'
        >
            <p className='leading-tight sm:leading-snug md:leading-normal break-words whitespace-normal'>
              {displayText1}
              {showCursor1 && <span className='animate-pulse'>|</span>}
            </p>
            <p className='leading-tight sm:leading-snug md:leading-normal mt-1 sm:mt-2 break-words whitespace-normal'>
              {displayText2}
              {showCursor2 && <span className='animate-pulse'>|</span>}
            </p>
        </div>
        <motion.div 
          className='absolute bottom-[20px] sm:bottom-[30px] md:top-[350px] lg:top-[500px] left-[50%] -translate-x-1/2 md:left-[10%] md:translate-x-0 flex items-center justify-center gap-[8px] md:gap-[10px]'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaCircle className={`w-[12px] md:w-[14px] cursor-pointer ${heroCount=== 0 ?"fill-orange-500":"fill-gray-700"}`} onClick={()=>setHeroCount(0)}/>
        </motion.div>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaCircle className={`w-[12px] md:w-[14px] cursor-pointer ${heroCount=== 1 ?"fill-orange-500":"fill-gray-700"}`} onClick={()=>setHeroCount(1)}/>
        </motion.div>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaCircle className={`w-[12px] md:w-[14px] cursor-pointer ${heroCount=== 2 ?"fill-orange-500":"fill-gray-700"}`} onClick={()=>setHeroCount(2)}/>
        </motion.div>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaCircle className={`w-[12px] md:w-[14px] cursor-pointer ${heroCount=== 3 ?"fill-orange-500":"fill-gray-700"}`} onClick={()=>setHeroCount(3)}/>
        </motion.div>
        </motion.div>
      
    </div>
  )
}

export default Hero
