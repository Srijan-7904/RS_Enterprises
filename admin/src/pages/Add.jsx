import React, { useContext } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import upload from '../assets/upload image.jpg'
import { useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'

function Add() {
  let [image1,setImage1] = useState(false)
  let [image2,setImage2] = useState(false)
  let [image3,setImage3] = useState(false)
  let [image4,setImage4] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("ir-camera")
  const [price, setPrice] = useState("")
  const [subCategory, setSubCategory] = useState("2mp-2-4mp")
  const [bestseller, setBestSeller] = useState(false)
  const [sizes,setSizes] = useState([])
  const [loading,setLoading] = useState(false)
  let {serverUrl} = useContext(authDataContext)

  const handleAddProduct = async (e) => {
    e.preventDefault()
    
    // Validate at least one image is selected
    if (!image1 && !image2 && !image3 && !image4) {
      toast.error("Please select at least 1 product image")
      return
    }
    
    // Validate required fields
    if (!name || !description || !price) {
      toast.error("Please fill in all required fields")
      return
    }
    
    setLoading(true)
    try {
      let formData = new FormData()
      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))
      formData.append("image1",image1)
      formData.append("image2",image2)
      formData.append("image3",image3)
      formData.append("image4",image4)

      let result = await axios.post(serverUrl + "/api/product/addproduct" , formData, {withCredentials:true} )

      console.log(result.data)
      toast.success("Product Added Successfully")
      setLoading(false)

      if(result.data){
          setName("")
      setDescription("")
      setImage1(false)
      setImage2(false)
      setImage3(false)
      setImage4(false)
      setPrice("")
      setBestSeller(false)
      setCategory("ir-camera")
      setSubCategory("2mp-2-4mp")
      setSizes([])
      }

      
    } catch (error) {
       console.log(error)
       setLoading(false)
       const errorMsg = error.response?.data?.message || "Add Product Failed"
       toast.error(errorMsg)
    }

    
  }
  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] text-[#0a5f7a] overflow-x-hidden relative'>
    <Nav/>
    <Sidebar/>


    <div className='w-[82%] h-[100%] flex items-center justify-start overflow-x-hidden absolute  right-0 bottom-[5%] '>

      <form action="" onSubmit={handleAddProduct} className='w-[100%] md:w-[90%] h-[100%]  mt-[70px] flex flex-col gap-[30px] py-[90px] px-[30px] md:px-[60px]'>
       <div className='w-[400px] h-[50px] text-[25px] md:text-[40px] text-[#0a5f7a] font-bold'>Add Product Page</div>

       <div className='w-[80%] h-[130px] flex items-start justify-center flex-col mt-[20px]  gap-[10px] '>
        <p className='text-[20px] md:text-[25px]  font-semibold'>
          Upload Images
        </p>
        <div className='w-[100%] h-[100%] flex items-center justify-start '>
          <label htmlFor="image1" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#1488aa]'>
            <img src={!image1 ? upload : URL.createObjectURL(image1)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-lg hover:border-[#b8dce8] border-2 border-[#b8dce8]' />
            <input type="file" id='image1' hidden onChange={(e)=>setImage1(e.target.files[0])} required />

          </label>
          <label htmlFor="image2" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#1488aa]'>
            <img src={!image2 ? upload : URL.createObjectURL(image2)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-lg hover:border-[#b8dce8] border-2 border-[#b8dce8]' />
            <input type="file" id='image2' hidden onChange={(e)=>setImage2(e.target.files[0])} required />

          </label>
          <label htmlFor="image3" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#1488aa]'>
            <img src={!image3 ? upload : URL.createObjectURL(image3)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-lg hover:border-[#b8dce8] border-2 border-[#b8dce8]' />
            <input type="file" id='image3' hidden onChange={(e)=>setImage3(e.target.files[0])} required />

          </label>
          <label htmlFor="image4" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#1488aa]'>
            <img src={!image4 ? upload : URL.createObjectURL(image4)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-lg hover:border-[#b8dce8] border-2 border-[#b8dce8]' />
            <input type="file" id='image4' hidden onChange={(e)=>setImage4(e.target.files[0])} required/>

          </label>
         
        </div>

       </div>

       <div className='w-[80%] h-[100px] flex items-start justify-center flex-col  gap-[10px]'>
        <p className='text-[20px] md:text-[25px]  font-semibold'>
          Product Name
        </p>
        <input type="text" placeholder='Type here'
        className='w-[600px] max-w-[98%] h-[40px] rounded-lg hover:border-[#1488aa] border-2 border-[#b8dce8] cursor-pointer bg-white px-[20px] text-[18px] text-[#0a5f7a] placeholder:text-[#5a8899]' onChange={(e)=>setName(e.target.value)} value={name} required/>
       </div>

        <div className='w-[80%] flex items-start justify-center flex-col  gap-[10px]'>
        <p className='text-[20px] md:text-[25px]  font-semibold'>
          Product Description
        </p>
        <textarea type="text" placeholder='Type here'
        className='w-[600px] max-w-[98%] h-[100px] rounded-lg hover:border-[#1488aa] border-2 border-[#b8dce8] cursor-pointer bg-white px-[20px] py-[10px] text-[18px] text-[#0a5f7a] placeholder:text-[#5a8899]' onChange={(e)=>setDescription(e.target.value)} value={description} required />
       </div>

       <div className='w-[80%]  flex items-center  gap-[10px] flex-wrap '>
        <div className='md:w-[30%] w-[100%] flex items-start sm:justify-center flex-col  gap-[10px]'>
          <p className='text-[20px] md:text-[25px]  font-semibold w-[100%]'>Product Category</p>
          <select name="" id="" className='bg-white border-2 border-[#b8dce8] text-[#0a5f7a] w-[60%] px-[10px] py-[7px] rounded-lg hover:border-[#1488aa]' onChange={(e)=>setCategory(e.target.value)} value={category}>
            <option value="ir-camera">IR Camera</option>
            <option value="network-camera">Network Camera</option>
            <option value="accessory">Accessories</option>
          </select>
        </div>
        <div className='md:w-[30%] w-[100%] flex items-start sm:justify-center flex-col  gap-[10px]'>
          <p className='text-[20px] md:text-[25px]  font-semibold w-[100%]'>Sub-Category</p>
          <select name="" id="" className='bg-white border-2 border-[#b8dce8] text-[#0a5f7a] w-[60%] px-[10px] py-[7px] rounded-lg hover:border-[#1488aa]' onChange={(e)=>setSubCategory(e.target.value)
          } value={subCategory}>
            <option value="2mp-2-4mp">2MP / 2.4MP</option>
            <option value="4mp-5mp">4MP / 5MP</option>
            <option value="ptz">PTZ</option>
            <option value="nvr-dvr">NVR / DVR</option>
            <option value="other-accessories">Other Accessories</option>
          </select>
        </div>
       </div>
       <div className='w-[80%] h-[100px] flex items-start justify-center flex-col  gap-[10px]'>
        <p className='text-[20px] md:text-[25px]  font-semibold'>
          Product Price
        </p>
        <input type="number" placeholder='₹ 2000'
        className='w-[600px] max-w-[98%] h-[40px] rounded-lg hover:border-[#1488aa] border-2 border-[#b8dce8] cursor-pointer bg-white px-[20px] text-[18px] text-[#0a5f7a] placeholder:text-[#5a8899]' onChange={(e)=>setPrice(e.target.value)} value={price} required/>
       </div>


       <div className='w-[80%] h-[220px] md:h-[100px] flex items-start justify-center flex-col gap-[10px] py-[10px] md:py-[0px]'>
        <p className='text-[20px] md:text-[25px]  font-semibold'>Range</p>

        <div className='flex items-center justify-start gap-[15px] flex-wrap'>
  <div
    className={`px-[20px] py-[7px] rounded-lg bg-white border-2 border-[#b8dce8] text-[18px] hover:border-[#1488aa] cursor-pointer ${sizes.includes("20") ? "bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white border-[#1488aa]" : "text-[#0a5f7a]"}`}
    onClick={() =>
      setSizes(prev => prev.includes("20") ? prev.filter(item => item !== "20") : [...prev, "20"])
    }
  >
    20
  </div>

  <div
    className={`px-[20px] py-[7px] rounded-lg bg-white border-2 border-[#b8dce8] text-[18px] hover:border-[#1488aa] cursor-pointer ${sizes.includes("40") ? "bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white border-[#1488aa]" : "text-[#0a5f7a]"}`}
    onClick={() =>
      setSizes(prev => prev.includes("40") ? prev.filter(item => item !== "40") : [...prev, "40"])
    }
  >
    40
  </div>

  <div
    className={`px-[20px] py-[7px] rounded-lg bg-white border-2 border-[#b8dce8] text-[18px] hover:border-[#1488aa] cursor-pointer ${sizes.includes("60") ? "bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white border-[#1488aa]" : "text-[#0a5f7a]"}`}
    onClick={() =>
      setSizes(prev => prev.includes("60") ? prev.filter(item => item !== "60") : [...prev, "60"])
    }
  >
    60
  </div>

  <div
    className={`px-[20px] py-[7px] rounded-lg bg-white border-2 border-[#b8dce8] text-[18px] hover:border-[#1488aa] cursor-pointer ${sizes.includes("80") ? "bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white border-[#1488aa]" : "text-[#0a5f7a]"}`}
    onClick={() =>
      setSizes(prev => prev.includes("80") ? prev.filter(item => item !== "80") : [...prev, "80"])
    }
  >
    80
  </div>

  <div
    className={`px-[20px] py-[7px] rounded-lg bg-white border-2 border-[#b8dce8] text-[18px] hover:border-[#1488aa] cursor-pointer ${sizes.includes("100") ? "bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white border-[#1488aa]" : "text-[#0a5f7a]"}`}
    onClick={() =>
      setSizes(prev => prev.includes("100") ? prev.filter(item => item !== "100") : [...prev, "100"])
    }
  >
    100
  </div>
</div>


       </div>

       <div className='w-[80%] flex items-center justify-start gap-[10px] mt-[20px]'>
        <input type="checkbox" id='checkbox' className='w-[25px] h-[25px] cursor-pointer' onChange={()=>setBestSeller(prev => !prev)}/>
        <label htmlFor="checkbox" className='text-[18px] md:text-[22px]  font-semibold'>
          Add to BestSeller
        </label>

       </div>

       <button className='w-[140px] px-[20px] py-[20px] rounded-xl bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] flex items-center justify-center gap-[10px] text-white font-semibold active:opacity-80 border-2 border-[#1488aa]'>{loading ? <Loading/> : "Add Product"}</button>




      </form>
    </div>
    </div>
  )
}

export default Add
