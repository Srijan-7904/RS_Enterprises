import React, { useContext, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import upload from '../assets/upload image.jpg'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { useLocation, useNavigate } from 'react-router-dom'

function EditProduct() {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product

  if (!product) {
    return (
      <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] text-[#0a5f7a] overflow-x-hidden'>
        <Nav />
        <Sidebar />
        <div className='w-[82%] ml-[18%] pt-[90px] pb-[60px] px-[24px] flex items-center justify-center'>
          <p className='text-[20px]'>No product found. Please select a product to edit.</p>
        </div>
      </div>
    )
  }

  let [image1, setImage1] = useState(false)
  let [image2, setImage2] = useState(false)
  let [image3, setImage3] = useState(false)
  let [image4, setImage4] = useState(false)
  const [name, setName] = useState(product.name || "")
  const [description, setDescription] = useState(product.description || "")
  const [category, setCategory] = useState(product.category || "ir-camera")
  const [price, setPrice] = useState(product.price || "")
  const [subCategory, setSubCategory] = useState(product.subCategory || "2mp-2-4mp")
  const [bestseller, setBestSeller] = useState(product.bestseller || false)
  const [sizes, setSizes] = useState(product.sizes || [])
  const [loading, setLoading] = useState(false)
  let { serverUrl } = useContext(authDataContext)

  const handleEditProduct = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      let formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))
      
      if (image1) formData.append("image1", image1)
      if (image2) formData.append("image2", image2)
      if (image3) formData.append("image3", image3)
      if (image4) formData.append("image4", image4)

      let result = await axios.post(serverUrl + `/api/product/edit/${product._id}`, formData, { withCredentials: true })

      console.log(result.data)
      toast.success("Product Updated Successfully")
      setLoading(false)
      navigate('/list')

    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error("Update Product Failed")
    }
  }

  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] text-[#0a5f7a] overflow-x-hidden relative'>
      <Nav />
      <Sidebar />

      <div className='w-[82%] h-[100%] flex items-center justify-start overflow-x-hidden absolute right-0 bottom-[5%]'>
        <form action="" onSubmit={handleEditProduct} className='w-[100%] md:w-[90%] h-[100%] mt-[70px] flex flex-col gap-[30px] py-[90px] px-[30px] md:px-[60px]'>
          <div className='w-[400px] h-[50px] text-[25px] md:text-[40px] text-[#0a5f7a] font-bold'>Edit Product</div>

          <div className='w-[80%] h-[130px] flex items-start justify-center flex-col mt-[20px] gap-[10px]'>
            <p className='text-[20px] md:text-[25px] font-semibold'>
              Upload Images (Optional - leave empty to keep existing)
            </p>
            <div className='w-[100%] h-[100%] flex items-center justify-start'>
              <label htmlFor="image1" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#1488aa]'>
                <img src={!image1 ? product.image1 : URL.createObjectURL(image1)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-lg hover:border-[#b8dce8] border-2 border-[#b8dce8]' />
                <input type="file" id='image1' hidden onChange={(e) => setImage1(e.target.files[0])} />
              </label>
              <label htmlFor="image2" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#1488aa]'>
                <img src={!image2 ? product.image2 : URL.createObjectURL(image2)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-lg hover:border-[#b8dce8] border-2 border-[#b8dce8]' />
                <input type="file" id='image2' hidden onChange={(e) => setImage2(e.target.files[0])} />
              </label>
              <label htmlFor="image3" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#1488aa]'>
                <img src={!image3 ? product.image3 : URL.createObjectURL(image3)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-lg hover:border-[#b8dce8] border-2 border-[#b8dce8]' />
                <input type="file" id='image3' hidden onChange={(e) => setImage3(e.target.files[0])} />
              </label>
              <label htmlFor="image4" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#1488aa]'>
                <img src={!image4 ? product.image4 : URL.createObjectURL(image4)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-lg hover:border-[#b8dce8] border-2 border-[#b8dce8]' />
                <input type="file" id='image4' hidden onChange={(e) => setImage4(e.target.files[0])} />
              </label>
            </div>
          </div>

          <div className='w-[80%] h-[100px] flex items-start justify-center flex-col gap-[10px]'>
            <p className='text-[20px] md:text-[25px] font-semibold'>
              Product Name
            </p>
            <input type="text" placeholder='Type here'
              className='w-[600px] max-w-[98%] h-[40px] rounded-lg hover:border-[#1488aa] border-2 border-[#b8dce8] cursor-pointer bg-white px-[20px] text-[18px] text-[#0a5f7a] placeholder:text-[#5a8899]' onChange={(e) => setName(e.target.value)} value={name} required />
          </div>

          <div className='w-[80%] flex items-start justify-center flex-col gap-[10px]'>
            <p className='text-[20px] md:text-[25px] font-semibold'>
              Product Description
            </p>
            <textarea type="text" placeholder='Type here'
              className='w-[600px] max-w-[98%] h-[100px] rounded-lg hover:border-[#1488aa] border-2 border-[#b8dce8] cursor-pointer bg-white px-[20px] py-[10px] text-[18px] text-[#0a5f7a] placeholder:text-[#5a8899]' onChange={(e) => setDescription(e.target.value)} value={description} required />
          </div>

          <div className='w-[80%] flex items-center gap-[10px] flex-wrap'>
            <div className='md:w-[30%] w-[100%] flex items-start sm:justify-center flex-col gap-[10px]'>
              <p className='text-[20px] md:text-[25px] font-semibold w-[100%]'>Product Category</p>
              <select name="" id="" className='bg-white border-2 border-[#b8dce8] text-[#0a5f7a] w-[60%] px-[10px] py-[7px] rounded-lg hover:border-[#1488aa]' onChange={(e) => setCategory(e.target.value)} value={category}>
                <option value="ir-camera">IR Camera</option>
                <option value="network-camera">Network Camera</option>
                <option value="accessory">Accessories</option>
              </select>
            </div>
            <div className='md:w-[30%] w-[100%] flex items-start sm:justify-center flex-col gap-[10px]'>
              <p className='text-[20px] md:text-[25px] font-semibold w-[100%]'>Sub-Category</p>
              <select name="" id="" className='bg-white border-2 border-[#b8dce8] text-[#0a5f7a] w-[60%] px-[10px] py-[7px] rounded-lg hover:border-[#1488aa]' onChange={(e) => setSubCategory(e.target.value)} value={subCategory}>
                <option value="2mp-2-4mp">2MP / 2.4MP</option>
                <option value="4mp-5mp">4MP / 5MP</option>
                <option value="ptz">PTZ</option>
                <option value="nvr-dvr">NVR / DVR</option>
                <option value="other-accessories">Other Accessories</option>
              </select>
            </div>
          </div>

          <div className='w-[80%] h-[100px] flex items-start justify-center flex-col gap-[10px]'>
            <p className='text-[20px] md:text-[25px] font-semibold'>
              Product Price
            </p>
            <input type="number" placeholder='₹ 2000'
              className='w-[600px] max-w-[98%] h-[40px] rounded-lg hover:border-[#1488aa] border-2 border-[#b8dce8] cursor-pointer bg-white px-[20px] text-[18px] text-[#0a5f7a] placeholder:text-[#5a8899]' onChange={(e) => setPrice(e.target.value)} value={price} required />
          </div>

          <div className='w-[80%] h-[220px] md:h-[100px] flex items-start justify-center flex-col gap-[10px] py-[10px] md:py-[0px]'>
            <p className='text-[20px] md:text-[25px] font-semibold'>Range</p>

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
            <input type="checkbox" id='checkbox' className='w-[25px] h-[25px] cursor-pointer' onChange={() => setBestSeller(prev => !prev)} checked={bestseller} />
            <label htmlFor="checkbox" className='text-[18px] md:text-[22px] font-semibold'>
              Add to BestSeller
            </label>
          </div>

          <div className='flex gap-[10px]'>
            <button className='w-[140px] px-[20px] py-[20px] rounded-xl bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] flex items-center justify-center gap-[10px] text-white font-semibold active:opacity-80 border-2 border-[#1488aa]'>
              {loading ? <Loading /> : "Update Product"}
            </button>
            <button 
              type='button'
              onClick={() => navigate('/list')}
              className='w-[140px] px-[20px] py-[20px] rounded-xl bg-[#5a8899] flex items-center justify-center gap-[10px] text-white font-semibold hover:bg-[#3a5a65] active:opacity-80 border-2 border-[#5a8899]'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
