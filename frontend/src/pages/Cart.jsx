import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { RiDeleteBin6Line } from "react-icons/ri";
import CartTotal from '../component/CartTotal';
import Footer from '../component/Footer';

function Cart() {
    const { products, currency, cartItem ,updateQuantity } = useContext(shopDataContext)
  const [cartData, setCartData] = useState([])
  const navigate = useNavigate()


  useEffect(() => {
    const tempData = [];
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItem[items][item],
          });
        }
      }
    }
    setCartData(tempData); 

  }, [cartItem]);
  return (
    <>
    <div className='w-[99vw] min-h-[100vh] p-[20px] overflow-hidden bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8]'>
      <div className='h-[8%] w-[100%] text-center mt-[80px]'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div className='w-[100%] h-[92%] flex flex-wrap gap-[20px]'>
        {
         cartData.map((item,index)=>{
             const productData = products.find((product) => product._id === item._id);
            
             if (!productData) return null;
             
             return (
              <div key={index} className='w-[100%] h-[10%] border-t border-b border-[#b8dce8]'>
                <div className='w-[100%] h-[80%] flex items-start gap-6 bg-white border-2 border-[#b8dce8] py-[10px] px-[20px] rounded-2xl relative shadow-md hover:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all'>
                    <img className='w-[100px] h-[100px] rounded-md shadow-sm' src={productData.image1} alt="" />
                    <div className='flex items-start justify-center flex-col gap-[10px]'>
                    <p className='md:text-[25px] text-[20px] text-[#0a5f7a] font-bold'>{productData.name}</p>
                    <div className='flex items-center gap-[20px]'>
                      <p className='text-[20px] text-[#1488aa] font-semibold'>{currency} {productData.price}</p>
                      <p className='text-[16px] text-[#2c5f6f] font-medium'>Range:</p>
                      <p className='w-[40px] h-[40px] text-[16px] text-[#0a5f7a] font-semibold bg-[#e8f4f8] rounded-md mt-[5px] flex items-center justify-center border-2 border-[#1488aa]'>{item.size}</p>
                </div>
                </div>
                <input type="number" min={1} defaultValue={item.quantity} className='md:max-w-20 max-w-10 md:px-2 md:py-2 py-[5px] px-[10px] text-[#0a5f7a] text-[18px] font-semibold bg-white absolute md:top-[40%] top-[46%] left-[75%] md:left-[50%] border-2 border-[#1488aa] rounded-md shadow-sm' onChange={(e)=> (e.target.value === ' ' || e.target.value === '0') ? null : updateQuantity(item._id,item.size,Number(e.target.value))} />

                <RiDeleteBin6Line className='text-[#1488aa] w-[25px] h-[25px] absolute top-[50%] md:top-[40%] md:right-[5%] right-1 hover:text-[#0a5f7a] cursor-pointer transition-colors' onClick={()=>updateQuantity(item._id,item.size,0)}/>
                </div>
 
              </div>
             )
         })
        }
      </div>

      <div className='flex justify-start items-end my-20'>
        <div className='w-full sm:w-[450px]'>
            <CartTotal/>
            <button className='text-[18px] hover:shadow-[0_0_30px_rgba(20,136,170,0.4)] cursor-pointer bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] py-[10px] px-[50px] rounded-2xl text-white font-bold flex items-center justify-center gap-[20px] border-2 border-[#1488aa] ml-[30px] mt-[20px] transition-all' onClick={()=>{
                if (cartData.length > 0) {
      navigate("/placeorder");
    } else {
      console.log("Your cart is empty!");
    }
            }}>
                PROCEED TO CHECKOUT
            </button>
        </div>
      </div>
      
    </div>
    <Footer/>
    </>
  )
}

export default Cart
