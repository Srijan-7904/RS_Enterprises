import React from 'react'
import back1 from "../assets/1.webp"
import back2 from "../assets/2.webp"
import back3 from "../assets/3.webp"
import back4 from "../assets/4.webp"

function Backgound({heroCount}) {
  
    if(heroCount === 0){
        return  <img src={back2} alt="" className=' p-20 w-[40%] h-[100vh] float-right  object-center bg-white'/>
    }else if(heroCount === 1){
       return  <img src={back1} alt="" className=' p-20 w-[35%] h-[100vh] float-right  object-center bg-white'/>

    }else if(heroCount === 2){
       return  <img src={back3} alt="" className=' p-20 w-[35%] h-[100vh] float-right  object-center bg-white'/>

    }else if(heroCount === 3){
       return  <img src={back4} alt="" className=' p-20 w-[45%] h-[100vh] float-right  object-center bg-white'/>

    }
  
}

export default Backgound
