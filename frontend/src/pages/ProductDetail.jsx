import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/authContext'
import { userDataContext } from '../context/UserContext'
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaCheck, FaThumbsUp, FaTrash, FaEdit } from "react-icons/fa"
import RelatedProduct from '../component/RelatedProduct'
import Loading from '../component/Loading'
import Footer from '../component/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'

function ProductDetail() {
  let { productId } = useParams()
  let { products, currency, addtoCart, loading } = useContext(shopDataContext)
  let { serverUrl } = useContext(authDataContext)
  let { userData } = useContext(userDataContext)
  let [productData, setProductData] = useState(false)

  const [image, setImage] = useState('')
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [image4, setImage4] = useState('')
  const [size, setSize] = useState('')

  // Review states
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage1(item.image1)
        setImage2(item.image2)
        setImage3(item.image3)
        setImage4(item.image4)
        setImage(item.image1)
        return null
      }
      return null
    })
  }

  // Fetch reviews for the product
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/review/product/${productId}`)
      if (response.data.success) {
        setReviews(response.data.reviews)
        setAverageRating(response.data.averageRating)
        setTotalReviews(response.data.totalReviews)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!userData) {
      toast.error("Please login to submit a review")
      return
    }

    if (userRating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (!userComment.trim()) {
      toast.error("Please write a comment")
      return
    }

    setReviewLoading(true)
    try {
      const response = await axios.post(
        `${serverUrl}/api/review/add`,
        {
          productId,
          rating: userRating,
          comment: userComment
        },
        { withCredentials: true }
      )

      if (response.data.success) {
        toast.success("Review submitted successfully!")
        setUserRating(0)
        setUserComment('')
        setShowReviewForm(false)
        fetchReviews()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review")
    }
    setReviewLoading(false)
  }

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return

    try {
      const response = await axios.delete(
        `${serverUrl}/api/review/delete/${reviewId}`,
        { withCredentials: true }
      )

      if (response.data.success) {
        toast.success("Review deleted successfully!")
        fetchReviews()
      }
    } catch (error) {
      toast.error("Failed to delete review")
    }
  }

  // Mark review as helpful
  const handleMarkHelpful = async (reviewId) => {
    try {
      const response = await axios.post(`${serverUrl}/api/review/helpful/${reviewId}`)
      if (response.data.success) {
        fetchReviews()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProductData()
    fetchReviews()
  }, [productId, products])

  return productData ? (
    <>
      <motion.div 
        className='w-[99vw] min-h-[100vh] bg-gradient-to-b from-[#e8f4f8] via-[#f5f9fc] to-[#e8f4f8] pt-[70px]'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main Product Section */}
        <div className='max-w-[1400px] mx-auto px-[20px] py-[40px] grid grid-cols-1 lg:grid-cols-2 gap-[40px]'>
          
          {/* Image Gallery */}
          <motion.div 
            className='flex flex-col gap-[20px]'
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Main Image */}
            <motion.div 
              className='w-full h-[400px] md:h-[500px] bg-white rounded-lg overflow-hidden border-2 border-[#b8dce8] shadow-lg'
              whileHover={{ borderColor: '#1488aa', boxShadow: '0 0 30px rgba(20, 136, 170, 0.2)' }}
            >
              <motion.img 
                key={image}
                src={image} 
                className='w-full h-full object-contain p-[10px]' 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Thumbnail Gallery */}
            <motion.div 
              className='flex gap-[15px] overflow-x-auto pb-[10px]'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[image1, image2, image3, image4].map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setImage(img)}
                  className={`flex-shrink-0 w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-lg border-2 overflow-hidden transition-all ${
                    image === img ? 'border-[#1488aa] shadow-lg shadow-[#1488aa]/50' : 'border-[#b8dce8] hover:border-[#1488aa]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} className='w-full h-full object-cover' />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className='flex flex-col gap-[25px]'
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Title & Rating */}
            <div>
              <motion.h1 
                className='text-[35px] md:text-[48px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0a5f7a] to-[#1488aa] mb-[15px]'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {productData.name}
              </motion.h1>

              <motion.div 
                className='flex items-center gap-[8px] mb-[15px]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className='flex gap-[4px]'>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-[16px] ${i < Math.floor(averageRating) ? 'text-[#fbbc04]' : 'text-[#cbd5e1]'}`} />
                  ))}
                </div>
                <span className='text-[#2c5f6f] ml-[10px] font-semibold'>
                  {averageRating > 0 ? `${averageRating} (${totalReviews} Reviews)` : '(No Reviews Yet)'}
                </span>
              </motion.div>

              {/* Price */}
              <motion.div 
                className='flex items-baseline gap-[15px]'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className='text-[42px] font-bold text-[#2d8a4d]'>
                  {currency} {productData.price}
                </span>
                <span className='text-[18px] text-[#5a8899] line-through'>
                  {currency} {(productData.price * 1.3).toFixed(0)}
                </span>
                <span className='bg-[#c93629] text-white px-[10px] py-[5px] rounded-full text-[14px] font-bold'>
                  20% OFF
                </span>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p 
              className='text-[17px] text-[#2c5f6f] leading-relaxed border-l-4 border-[#1488aa] pl-[15px] font-medium'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {productData.description}
            </motion.p>

            {/* Benefits */}
            <motion.div 
              className='bg-[#e0eff5] border border-[#b8dce8] rounded-lg p-[15px] space-y-[10px]'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className='flex items-center gap-[10px] text-[#0a5f7a]'>
                <FaCheck className='text-[#2d8a4d]' />
                <span>100% Original & Authentic</span>
              </div>
              <div className='flex items-center gap-[10px] text-[#0a5f7a]'>
                <FaCheck className='text-[#2d8a4d]' />
                <span>Easy 7-Day Return & Exchange</span>
              </div>
              <div className='flex items-center gap-[10px] text-[#0a5f7a]'>
                <FaCheck className='text-[#2d8a4d]' />
                <span>Secure Checkout & Fast Delivery</span>
              </div>
            </motion.div>

            {/* Size Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className='block text-[18px] font-bold text-[#0a5f7a] mb-[12px]'>
                Select Range
              </label>
              <div className='flex flex-wrap gap-[10px]'>
                {productData.sizes.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`px-[20px] py-[10px] rounded-lg font-semibold text-[16px] border-2 transition-all ${
                      item === size
                        ? 'bg-[#1488aa] text-white border-[#2d8a4d]'
                        : 'bg-white text-[#0a5f7a] border-[#b8dce8] hover:border-[#1488aa]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={() => addtoCart(productData._id, size)}
              className='w-full py-[15px] bg-gradient-to-r from-[#1488aa] via-[#1488aa] to-[#2d8a4d] text-white font-bold text-[18px] rounded-lg flex items-center justify-center gap-[10px] hover:shadow-lg hover:shadow-[#1488aa]/50'
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(20, 136, 170, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <FaShoppingCart />
              {loading ? <Loading /> : 'Add to Cart'}
            </motion.button>

            {/* Stock Status */}
            <motion.div 
              className='text-center text-[15px] text-[#3a5a65] font-medium'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              ✓ In Stock - Ships within 2-3 Business Days
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Reviews & Ratings Section */}
      <motion.div 
        className='w-full bg-white py-[60px]'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className='max-w-[1400px] mx-auto px-[20px]'>
          {/* Section Header */}
          <div className='flex items-center justify-between mb-[40px]'>
            <div>
              <h2 className='text-[32px] font-bold text-[#0a5f7a] mb-[5px]'>Customer Reviews</h2>
              <p className='text-[#5a8899]'>Share your thoughts with other customers</p>
            </div>
            {userData && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReviewForm(!showReviewForm)}
                className='px-[25px] py-[12px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(20,136,170,0.3)] transition-all'
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </motion.button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-lg p-[30px] mb-[40px]'
            >
              <h3 className='text-[22px] font-bold text-[#0a5f7a] mb-[20px]'>Write Your Review</h3>
              <form onSubmit={handleSubmitReview}>
                {/* Star Rating */}
                <div className='mb-[20px]'>
                  <label className='block text-[16px] font-semibold text-[#0a5f7a] mb-[10px]'>
                    Your Rating *
                  </label>
                  <div className='flex gap-[8px]'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type='button'
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setUserRating(star)}
                      >
                        <FaStar
                          className={`text-[32px] cursor-pointer transition-colors ${
                            star <= userRating ? 'text-[#fbbc04]' : 'text-[#cbd5e1]'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className='mb-[20px]'>
                  <label className='block text-[16px] font-semibold text-[#0a5f7a] mb-[10px]'>
                    Your Review *
                  </label>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder='Share your experience with this product...'
                    rows='5'
                    className='w-full px-[16px] py-[12px] border-2 border-[#b8dce8] rounded-lg bg-white text-[#0a5f7a] placeholder-[#5a8899] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all resize-none'
                    required
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type='submit'
                  disabled={reviewLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='px-[30px] py-[12px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(20,136,170,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {reviewLoading ? <Loading /> : 'Submit Review'}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Reviews List */}
          <div className='space-y-[20px]'>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className='bg-[#f5f9fc] border-2 border-[#b8dce8] rounded-lg p-[25px] hover:border-[#1488aa] transition-all'
                >
                  <div className='flex items-start justify-between mb-[15px]'>
                    <div>
                      {/* User Info */}
                      <div className='flex items-center gap-[12px] mb-[10px]'>
                        <div className='w-[45px] h-[45px] bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] text-white rounded-full flex items-center justify-center font-bold text-[18px]'>
                          {review.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className='text-[18px] font-bold text-[#0a5f7a]'>{review.userName}</h4>
                          <p className='text-[13px] text-[#5a8899]'>
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Star Rating */}
                      <div className='flex gap-[4px] mb-[12px]'>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-[16px] ${
                              i < review.rating ? 'text-[#fbbc04]' : 'text-[#cbd5e1]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Delete Button (only for review owner) */}
                    {userData && userData._id === review.userId && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteReview(review._id)}
                        className='text-[#c93629] hover:text-[#a02a1f] transition-colors'
                      >
                        <FaTrash className='text-[18px]' />
                      </motion.button>
                    )}
                  </div>

                  {/* Review Comment */}
                  <p className='text-[15px] text-[#2c5f6f] leading-relaxed mb-[15px]'>
                    {review.comment}
                  </p>

                  {/* Helpful Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMarkHelpful(review._id)}
                    className='flex items-center gap-[8px] text-[#1488aa] hover:text-[#0a5f7a] font-semibold transition-colors'
                  >
                    <FaThumbsUp className='text-[14px]' />
                    <span className='text-[14px]'>Helpful ({review.helpful})</span>
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <div className='text-center py-[60px]'>
                <p className='text-[20px] text-[#5a8899] font-semibold mb-[10px]'>No reviews yet</p>
                <p className='text-[15px] text-[#5a8899]'>Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Related Products Section */}
      <motion.div 
        className='w-full bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] py-[60px]'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <RelatedProduct
          category={productData.category}
          subCategory={productData.subCategory}
          currentProductId={productData._id}
        />
      </motion.div>

      <Footer />
    </>
  ) : (
    <div className='opacity-0'></div>
  )
}

export default ProductDetail
