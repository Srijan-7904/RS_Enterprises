import React from 'react'
import back1 from "../assets/1.webp"
import back2 from "../assets/2.webp"
import back3 from "../assets/3.webp"
import back4 from "../assets/4.webp"

function Backgound({heroCount}) {
  
    if(heroCount === 0){
        return  <img src={back2} alt="" className='p-4 sm:p-8 md:p-12 lg:p-20 w-full sm:w-[60%] md:w-[45%] lg:w-[40%] h-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[80vh] lg:max-h-[100vh] float-right object-contain bg-white mt-[10px] sm:mt-[15px] md:mt-[20px]'/>
    }else if(heroCount === 1){
       return  <img src={back1} alt="" className='p-4 sm:p-8 md:p-12 lg:p-20 w-full sm:w-[55%] md:w-[40%] lg:w-[35%] h-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[80vh] lg:max-h-[100vh] float-right object-contain bg-white mt-[10px] sm:mt-[15px] md:mt-[20px]'/>

    }else if(heroCount === 2){
       return  <img src={back3} alt="" className='p-4 sm:p-8 md:p-12 lg:p-20 w-full sm:w-[55%] md:w-[40%] lg:w-[35%] h-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[80vh] lg:max-h-[100vh] float-right object-contain bg-white mt-[10px] sm:mt-[15px] md:mt-[20px]'/>

    }else if(heroCount === 3){
       return  <img src={back4} alt="" className='p-4 sm:p-8 md:p-12 lg:p-20 w-full sm:w-[65%] md:w-[50%] lg:w-[45%] h-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[80vh] lg:max-h-[100vh] float-right object-contain bg-white mt-[10px] sm:mt-[15px] md:mt-[20px]'/>

    }
  
}

export default Backgound
