import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'

function Order() {
    let [orderData,setOrderData] = useState([])
    let {currency} = useContext(shopDataContext)
    let {serverUrl} = useContext(authDataContext)

    const loadOrderData = async () => {
       try {
      const result = await axios.post(serverUrl + '/api/order/userorder',{},{withCredentials:true})
      if(result.data){
        let allOrdersItem = []
        result.data.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    }
    }

useEffect(()=>{
 loadOrderData()
},[])


  return (
    <div className='w-[99vw] min-h-[100vh] p-[20px] pb-[150px]  overflow-hidden bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] '>
      <div className='h-[8%] w-[100%] text-center mt-[80px]'>
        <Title text1={'MY'} text2={'ORDER'} />
      </div>
      <div className=' w-[100%] h-[92%] flex flex-wrap gap-[20px]'>
        {
         orderData.map((item,index)=>(
            <div key={index} className='w-[100%] h-[10%] border-t border-b border-[#b8dce8]'>
                <div className='w-[100%] h-[80%] flex items-start gap-6 bg-white border-2 border-[#b8dce8]  py-[10px] px-[20px] rounded-2xl relative shadow-md'>
                    <img src={item.image1} alt="" className='w-[130px] h-[130px] rounded-md border-2 border-[#b8dce8]'/>
                    <div className='flex items-start justify-center flex-col gap-[5px]'>
                    <p className='md:text-[25px] text-[20px] text-[#0a5f7a] font-bold'>{item.name}</p>
                    <div className='flex items-center gap-[8px]   md:gap-[20px]'>
                        <p className='md:text-[18px] text-[12px] text-[#1488aa] font-semibold'>{currency} {item.price}</p>
                      <p className='md:text-[18px] text-[12px] text-[#1488aa] font-semibold'>Quantity: {item.quantity}</p>
                      <p className='md:text-[18px] text-[12px] text-[#1488aa] font-semibold'>Range: {item.size}</p>
                    </div>
                    <div className='flex items-center'>
                     <p className='md:text-[18px] text-[12px] text-[#3a5a65] font-semibold'>Date: <span className='text-[#0a5f7a] pl-[10px] md:text-[16px] text-[11px]'>{new Date(item.date).toDateString()}</span></p>
                    </div>
                    <div className='flex items-center'>
                      <p className='md:text-[16px] text-[12px] text-[#3a5a65] font-semibold'>Payment Method :{item.paymentMethod}</p>
                    </div>
                    <div className='absolute md:left-[55%] md:top-[40%] right-[2%] top-[2%]  '>
                        <div className='flex items-center gap-[5px]'>
                      <p className='min-w-2 h-2 rounded-full bg-green-500'></p> 
                      <p className='md:text-[17px] text-[10px] text-[#0a5f7a] font-bold'>{item.status}</p>

                    </div>

                    </div>
                     <div className='absolute md:right-[5%] right-[1%] md:top-[40%] top-[70%]'> 
                    <button className='md:px-[15px] px-[5px] py-[3px] md:py-[7px] rounded-md bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white text-[12px] md:text-[16px] font-bold cursor-pointer hover:shadow-[0_0_20px_rgba(20,136,170,0.3)] active:scale-95 transition-all border-2 border-[#1488aa]' onClick={loadOrderData} >Track Order</button>
                  </div>
                    </div>
                </div>
               
            </div>
         ))
        }
      </div>
    </div>
  )
}

export default Order
