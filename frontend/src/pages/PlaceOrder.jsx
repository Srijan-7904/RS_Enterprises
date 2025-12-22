import React, { useContext, useState } from 'react'
import Title from '../component/Title'
import CartTotal from '../component/CartTotal'
import razorpay from '../assets/Razorpay.jpg'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'

function PlaceOrder() {
    let [method,setMethod] = useState('cod')
    let navigate = useNavigate()
    const {cartItem , setCartItem , getCartAmount , delivery_fee , products } = useContext(shopDataContext)
    let {serverUrl} = useContext(authDataContext)
    let [loading ,setLoading] = useState(false)

    let [formData,setFormData] = useState({
        firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    pinCode:'',
    country:'',
    phone:''
    })

    const onChangeHandler = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({...data,[name]:value}))
    }

    const initPay = (order) =>{
        const options = {
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name:'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response)
    const {data} = await axios.post(serverUrl + '/api/order/verifyrazorpay',response,{withCredentials:true})
    if(data){
        navigate("/order")
        setCartItem({})

    }
      }}
    const rzp = new window.Razorpay(options)
    rzp.open()
   }

    
     const onSubmitHandler = async (e) => {
        
    setLoading(true)
        e.preventDefault()
    try {
      let orderItems = []
      for(const items in cartItem){
        for(const item in cartItem[items]){
          if(cartItem[items][item] > 0){
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if(itemInfo){
               itemInfo.size = item
               itemInfo.quantity = cartItem[items][item]
               orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData = {
        address:formData,
        items:orderItems,
        amount:getCartAmount() + delivery_fee
      }
      switch(method){
        case 'cod': 
      
        const result = await axios.post(serverUrl + "/api/order/placeorder" , orderData , {withCredentials:true})
        console.log(result.data)
        if(result.data){
            setCartItem({})
            toast.success("Order Placed")
            navigate("/order")
            setLoading(false)

        }else{
            console.log(result.data.message)
            toast.error("Order Placed Error")
             setLoading(false)
        }

        break;

        case 'razorpay':
        const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay" , orderData , {withCredentials:true})
        if(resultRazorpay.data){
          initPay(resultRazorpay.data)
           toast.success("Order Placed")
           setLoading(false)
        }

        break;




        default:
        break;

      }
    
      
    } catch (error) {
      console.log(error)
    
    }
     }
  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] flex items-center justify-center flex-col md:flex-row gap-[50px] relative'>
        <div className='lg:w-[50%] w-[100%] h-[100%] flex items-center justify-center  lg:mt-[0px] mt-[90px] '>
            <form action="" onSubmit={onSubmitHandler} className='lg:w-[70%] w-[95%] lg:h-[70%] h-[100%]'>
        <div className='py-[10px]'>
        <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
        <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>

         <input type="text" placeholder='First name' className='w-[48%] h-[50px] rounded-md bg-white border-2 border-[#b8dce8] placeholder:text-[#5a8899] text-[#0a5f7a] text-[18px] px-[20px] shadow-sm focus:border-[#1488aa] focus:outline-none transition-colors' required onChange={onChangeHandler} name='firstName' value={formData.firstName}/>

          <input type="text" placeholder='Last name' className='w-[48%] h-[50px] rounded-md shadow-sm bg-white border-2 border-[#b8dce8] placeholder:text-[#5a8899] text-[#0a5f7a] text-[18px] px-[20px] focus:border-[#1488aa] focus:outline-none transition-colors' required onChange={onChangeHandler} name='lastName' value={formData.lastName} />
        </div>

        <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
          <input type="email" placeholder='Email address' className='w-[100%] h-[50px] rounded-md shadow-sm bg-white border-2 border-[#b8dce8] placeholder:text-[#5a8899] text-[#0a5f7a] text-[18px] px-[20px] focus:border-[#1488aa] focus:outline-none transition-colors' required onChange={onChangeHandler} name='email' value={formData.email} />
         
        </div>
        <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
          <input type="text" placeholder='Street' className='w-[100%] h-[50px] rounded-md bg-white border-2 border-[#b8dce8] shadow-sm placeholder:text-[#5a8899] text-[#0a5f7a] text-[18px] px-[20px] focus:border-[#1488aa] focus:outline-none transition-colors' required onChange={onChangeHandler} name='street' value={formData.street} />
         
        </div>
        <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
          <input type="text" placeholder='City' className='w-[48%] h-[50px] rounded-md bg-white border-2 border-[#b8dce8] shadow-sm placeholder:text-[#5a8899] text-[#0a5f7a] text-[18px] px-[20px] focus:border-[#1488aa] focus:outline-none transition-colors' required onChange={onChangeHandler} name='city' value={formData.city} />
          <input type="text" placeholder='State' className='w-[48%] h-[50px] rounded-md bg-white border-2 border-[#b8dce8] shadow-sm placeholder:text-[#5a8899] text-[#0a5f7a] text-[18px] px-[20px] focus:border-[#1488aa] focus:outline-none transition-colors' required onChange={onChangeHandler} name='state' value={formData.state} />
        </div>
        <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
          <input type="text" placeholder='Pincode' className='w-[48%] h-[50px] rounded-md bg-white border-2 border-[#b8dce8] shadow-sm placeholder:text-[#5a8899] text-[#0a5f7a] text-[18px] px-[20px] focus:border-[#1488aa] focus:outline-none transition-colors' required onChange={onChangeHandler} name='pinCode' value={formData.pinCode} />
          <input type="text" placeholder='Country' className='w-[48%] h-[50px] rounded-md bg-white border-2 border-[#b8dce8] shadow-sm placeholder:text-[#5a8899] text-[#0a5f7a] text-[18px] px-[20px] focus:border-[#1488aa] focus:outline-none transition-colors' required onChange={onChangeHandler} name='country' value={formData.country} />
        </div>
         <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
          <input type="text" placeholder='Phone' className='w-[100%] h-[50px] rounded-md bg-white border-2 border-[#b8dce8] shadow-sm placeholder:text-[#5a8899] text-[#0a5f7a] text-[18px] px-[20px] focus:border-[#1488aa] focus:outline-none transition-colors' required onChange={onChangeHandler} name='phone' value={formData.phone} />
         
        </div>
        <div>
          <button type='submit' className='text-[18px] active:scale-95 cursor-pointer bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] py-[10px] px-[50px] rounded-2xl text-white font-bold flex items-center justify-center gap-[20px] absolute lg:right-[20%] bottom-[10%] right-[35%] border-2 border-[#1488aa] ml-[30px] mt-[20px] hover:shadow-[0_0_30px_rgba(20,136,170,0.4)] transition-all' >{loading? <Loading/> : "PLACE ORDER"}</button>
         </div> 


            </form>

       
        </div>
         <div className='lg:w-[50%] w-[100%] min-h-[100%] flex items-center justify-center gap-[30px] '>
            <div className='lg:w-[70%] w-[90%] lg:h-[70%] h-[100%]  flex items-center justify-center gap-[10px] flex-col'>
                <CartTotal/>
                <div className='py-[10px]'>
        <Title text1={'PAYMENT'} text2={'METHOD'}/>
        </div>
        <div className='w-[100%] h-[30vh] lg:h-[100px] flex items-start mt-[20px] lg:mt-[0px] justify-center gap-[50px]'>
        <button onClick={()=>setMethod('razorpay')} className={`w-[150px] h-[50px] rounded-sm border-2 ${method === 'razorpay' ? 'border-[5px] border-[#1488aa] rounded-sm shadow-[0_0_20px_rgba(20,136,170,0.3)]' : 'border-[#b8dce8]'} transition-all`}> <img src={razorpay} className='w-[100%] h-[100%] object-fill rounded-sm' alt="" /></button>
        <button onClick={()=>setMethod('cod')} className={`w-[200px] h-[50px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-[16px] px-[20px] rounded-sm text-white font-bold border-2 ${method === 'cod' ? 'border-[5px] border-[#1488aa] rounded-sm shadow-[0_0_20px_rgba(20,136,170,0.3)]' : 'border-[#1488aa]'} transition-all hover:shadow-[0_0_20px_rgba(20,136,170,0.2)]`}>CASH ON DELIVERY </button>
        </div>
            </div>
        </div>
      
    </div>
  )
}

export default PlaceOrder
