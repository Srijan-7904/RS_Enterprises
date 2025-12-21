import React, { useContext, useEffect, useState } from 'react'
import { FaChevronRight, FaChevronDown } from "react-icons/fa"
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import Card from '../component/Card'
import Footer from '../component/Footer'

function Collections() {

  const [showFilter, setShowFilter] = useState(false)
  const { products, search, showSearch } = useContext(shopDataContext)

  const [filterProduct, setFilterProduct] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState("relavent")

  // -------- CATEGORY TOGGLE ----------
  const toggleCategory = (e) => {
    const value = e.target.value
    setCategory(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }

  // -------- SUB CATEGORY TOGGLE ----------
  const toggleSubCategory = (e) => {
    const value = e.target.value
    setSubCategory(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }

  // -------- APPLY FILTER ----------
  const applyFilter = () => {
    let productCopy = [...products]

    if (showSearch && search) {
      productCopy = productCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category.length > 0) {
      productCopy = productCopy.filter(item =>
        category.includes(item.category)
      )
    }

    if (subCategory.length > 0) {
      productCopy = productCopy.filter(item =>
        subCategory.includes(item.subCategory)
      )
    }

    setFilterProduct(productCopy)
  }

  // -------- SORT PRODUCTS ----------
  const sortProducts = () => {
    let sorted = [...filterProduct]

    if (sortType === "low-high") {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortType === "high-low") {
      sorted.sort((a, b) => b.price - a.price)
    }

    setFilterProduct(sorted)
  }

  // -------- EFFECTS ----------
  useEffect(() => {
    setFilterProduct(products)
  }, [products])

  useEffect(() => {
    applyFilter()
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    if (sortType !== "relavent") {
      sortProducts()
    }
  }, [sortType])

  return (
    <>
      <div className='w-[99vw] min-h-[100vh] bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] flex flex-col md:flex-row pt-[70px] overflow-x-hidden pb-[110px]'>

        {/* ---------------- FILTER SIDEBAR ---------------- */}
        <div
  className={`
    md:w-[30vw] lg:w-[20vw] w-[100vw]
    p-[20px]
    border-r-2 border-[#b8dce8]
    text-[#0a5f7a]
    lg:sticky
    top-[90px]
    max-h-[calc(100vh-110px)]
    overflow-y-auto
    scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200
    ${showFilter ? "block" : "md:block hidden"}
  `}
>

          <p
            className='text-[25px] font-semibold flex gap-2 items-center cursor-pointer md:cursor-default'
            onClick={() => setShowFilter(prev => !prev)}
          >
            FILTERS
            {!showFilter && <FaChevronRight className='md:hidden text-[18px]' />}
            {showFilter && <FaChevronDown className='md:hidden text-[18px]' />}
          </p>

          {/* CATEGORY */}
          <div className='border-2 border-[#b8dce8] pl-5 py-3 mt-6 rounded-md bg-white shadow-sm'>
            <p className='text-[18px] text-[#0a5f7a] font-bold'>CATEGORIES</p>

            <div className='mt-3 space-y-2'>
              <label className='flex gap-2 text-sm'>
                <input type="checkbox" value="ir-camera" onChange={toggleCategory} />
                IR Camera
              </label>

              <label className='flex gap-2 text-sm'>
                <input type="checkbox" value="network-camera" onChange={toggleCategory} />
                Network Camera
              </label>

              <label className='flex gap-2 text-sm'>
                <input type="checkbox" value="accessory" onChange={toggleCategory} />
                Accessories
              </label>
            </div>
          </div>

          {/* SUB CATEGORY */}
          <div className='border-2 border-[#b8dce8] pl-5 py-3 mt-6 rounded-md bg-white shadow-sm'>
            <p className='text-[18px] text-[#0a5f7a] font-bold'>SUB-CATEGORIES</p>

            <div className='mt-3 space-y-2'>
              <label className='flex gap-2 text-sm'>
                <input type="checkbox" value="2mp-2-4mp" onChange={toggleSubCategory} />
                2MP / 2.4MP
              </label>

              <label className='flex gap-2 text-sm'>
                <input type="checkbox" value="4mp-5mp" onChange={toggleSubCategory} />
                4MP / 5MP
              </label>

              <label className='flex gap-2 text-sm'>
                <input type="checkbox" value="ptz" onChange={toggleSubCategory} />
                PTZ
              </label>

              <label className='flex gap-2 text-sm'>
                <input type="checkbox" value="nvr-dvr" onChange={toggleSubCategory} />
                NVR / DVR
              </label>

              <label className='flex gap-2 text-sm'>
                <input type="checkbox" value="other-accessories" onChange={toggleSubCategory} />
                Other Accessories
              </label>
            </div>
          </div>
        </div>

        {/* ---------------- PRODUCTS SECTION ---------------- */}
        <div className='lg:pl-[2%] md:pl-[3%] w-full'>
          <div className='flex flex-col lg:flex-row justify-between items-start lg:px-[30px] md:px-[20px] px-[10px] gap-4'>
            <Title text1="ALL" text2="COLLECTIONS" />

            <select
              className='bg-white w-[200px] h-[45px] px-3 text-[#0a5f7a] rounded-lg border-2 border-[#b8dce8] hover:border-[#1488aa] shadow-sm'
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="relavent">Sort By: Relevant</option>
              <option value="low-high">Sort By: Low to High</option>
              <option value="high-low">Sort By: High to Low</option>
            </select>
          </div>

          <div className='flex flex-wrap justify-center gap-8 mt-6 min-h-[70vh]'>
            {filterProduct.map((item) => (
              <Card
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image1}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Collections
