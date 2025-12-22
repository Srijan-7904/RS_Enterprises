import React, { useEffect, useState } from 'react'
import Backgound from '../component/Backgound'
import Hero from '../component/Hero'
import Product from './Product'
import OurPolicy from '../component/OurPolicy'
import NewLetterBox from '../component/NewLetterBox'
import Footer from '../component/Footer'
import CounterStats from '../component/CounterStats'
import Testimonials from '../component/Testimonials'
import Features from '../component/Features'


function Home() {
  let heroData = [
  {
    text1: "30% OFF on Smart CCTV Systems",
    text2: "Secure What Matters Most"
  },
  {
    text1: "Advanced Surveillance Solutions",
    text2: "Crystal Clear Day & Night"
  },
  {
    text1: "Protect Your Home & Business",
    text2: "24/7 Monitoring Guaranteed"
  },
  {
    text1: "Next-Gen Cameras & Accessories",
    text2: "Safety Starts Here"
  }
];


  let [heroCount,setHeroCount] = useState(0)

  useEffect(()=>{
    let interval = setInterval(()=>{
      setHeroCount(prevCount => (prevCount === 3 ? 0 : prevCount + 1));
    },3000);
    return () => clearInterval(interval)
  },[])
  
  return (
    <div className='overflow-x-hidden relative top-[0px]'>
    <div className=' w-[100vw] lg:h-[80vh] md:h-[50vh] sm:h-[30vh] bg-white'>

      <Backgound heroCount={heroCount}/>
      <Hero
      heroCount={heroCount}
      setHeroCount={setHeroCount}
      heroData={heroData[heroCount]}
      />


     
    </div>
    <Product/>
    <Features/>
    <CounterStats/>
    <Testimonials/>
    <OurPolicy/>
    <NewLetterBox/>
    <Footer/>
    </div>
  )
}

export default Home
