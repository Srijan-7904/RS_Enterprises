import React from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { useState } from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Home() {
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalOrders, setTotalOrders] = useState(0)
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [completedOrders, setCompletedOrders] = useState(0)
    const [recentOrders, setRecentOrders] = useState([])
    const [bestSellers, setBestSellers] = useState([])
    const [dailyRevenue, setDailyRevenue] = useState([])
    const [orderStatus, setOrderStatus] = useState([])
    
    const { serverUrl } = useContext(authDataContext)

    const fetchCounts = async () => {
      try {
        // Fetch products
        const productsRes = await axios.get(`${serverUrl}/api/product/list`, {withCredentials:true})
        console.log("Products data:", productsRes.data)
        setTotalProducts(productsRes.data?.length || 0)

        // Fetch orders
        const ordersRes = await axios.post(`${serverUrl}/api/order/list`, {}, {withCredentials:true})
        console.log("Orders data:", ordersRes.data)
        const orderList = Array.isArray(ordersRes.data) ? ordersRes.data : []
        setTotalOrders(orderList.length)

        // Calculate total revenue and completed orders
        let revenue = 0
        let completed = 0
        const recentOrdersList = []
        const dailyRevenueMap = {}
        const statusMap = { 'Pending': 0, 'Processing': 0, 'Completed': 0, 'Cancelled': 0 }
        
        orderList.forEach(order => {
          const orderTotal = order.amount || (order.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0)
          revenue += orderTotal
          
          const status = order.status || 'Pending'
          if (status === 'completed' || status === 'Completed') {
            completed++
            statusMap['Completed']++
          } else if (status === 'processing' || status === 'Processing') {
            statusMap['Processing']++
          } else if (status === 'cancelled' || status === 'Cancelled') {
            statusMap['Cancelled']++
          } else {
            statusMap['Pending']++
          }
          
          // Daily revenue tracking
          const dateKey = new Date(order.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
          dailyRevenueMap[dateKey] = (dailyRevenueMap[dateKey] || 0) + orderTotal
          
          recentOrdersList.push({
            _id: order._id,
            address: (order.address || 'N/A').slice(0, 30) + '...',
            date: new Date(order.date).toLocaleDateString(),
            amount: orderTotal || 0,
            status: status
          })
        })
        
        setTotalRevenue(revenue)
        setCompletedOrders(completed)
        setRecentOrders(recentOrdersList.slice(0, 5))

        // Format daily revenue for chart
        const dailyData = Object.entries(dailyRevenueMap)
          .slice(-7)
          .map(([date, amount]) => ({ date, amount }))
        setDailyRevenue(dailyData)

        // Format status data for pie chart
        const statusData = Object.entries(statusMap)
          .filter(([_, count]) => count > 0)
          .map(([name, value]) => ({ name, value }))
        setOrderStatus(statusData)

        // Get best sellers
        const bestSellersList = {}
        orderList.forEach(order => {
          (order.items || []).forEach(item => {
            const productName = item.name || 'Unknown'
            bestSellersList[productName] = (bestSellersList[productName] || 0) + (item.quantity || 1)
          })
        })
        
        const sorted = Object.entries(bestSellersList)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, qty]) => ({ name: name.slice(0, 25), quantity: qty }))
        
        setBestSellers(sorted)

      } catch (err) {
        console.error("Failed to fetch counts:", err.response?.data || err.message)
      }
    }

    useEffect(() => {
      fetchCounts()
    }, [])

    const COLORS = ['#1488aa', '#2d8a4d', '#fbbc04', '#ea4335']

    return (
      <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] text-[#0a5f7a] relative'>
        <Nav/>
        <Sidebar/>

        <div className='w-[82%] ml-[18%] pt-[90px] pb-[60px] px-[24px] md:px-[48px] flex flex-col gap-[40px]'>
          <h1 className='text-[35px] md:text-[45px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1488aa] to-[#2d8a4d]'>Sales Dashboard</h1>
          
          {/* Top Metrics */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]'>
            {/* Total Products */}
            <div className='bg-white border-2 border-[#b8dce8] rounded-xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow'>
              <p className='text-[14px] text-[#5a8899]'>Total Products</p>
              <h2 className='text-[32px] font-bold text-[#1488aa]'>{totalProducts}</h2>
              <p className='text-[12px] text-[#5a8899]'>Active inventory</p>
            </div>

            {/* Total Orders */}
            <div className='bg-white border-2 border-[#b8dce8] rounded-xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow'>
              <p className='text-[14px] text-[#5a8899]'>Total Orders</p>
              <h2 className='text-[32px] font-bold text-[#1488aa]'>{totalOrders}</h2>
              <p className='text-[12px] text-[#5a8899]'>All time orders</p>
            </div>

            {/* Total Revenue */}
            <div className='bg-white border-2 border-[#b8dce8] rounded-xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow'>
              <p className='text-[14px] text-[#5a8899]'>Total Revenue</p>
              <h2 className='text-[32px] font-bold text-[#2d8a4d]'>₹{totalRevenue.toLocaleString()}</h2>
              <p className='text-[12px] text-[#5a8899]'>Lifetime earnings</p>
            </div>

            {/* Completed Orders */}
            <div className='bg-white border-2 border-[#b8dce8] rounded-xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow'>
              <p className='text-[14px] text-[#5a8899]'>Completed Orders</p>
              <h2 className='text-[32px] font-bold text-[#fbbc04]'>{completedOrders}</h2>
              <p className='text-[12px] text-[#5a8899]'>Order fulfillment</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-[20px]'>
            {/* Daily Revenue Chart */}
            {dailyRevenue.length > 0 && (
              <div className='bg-white border-2 border-[#b8dce8] rounded-xl p-6 shadow-sm'>
                <h3 className='text-[18px] font-bold text-[#1488aa] mb-4'>Daily Revenue (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#b8dce8" />
                    <XAxis dataKey="date" stroke="#5a8899" style={{fontSize: '12px'}} />
                    <YAxis stroke="#5a8899" style={{fontSize: '12px'}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'white', border: '1px solid #b8dce8', borderRadius: '8px'}}
                      labelStyle={{color: '#1488aa'}}
                      formatter={(value) => `₹${value}`}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#1488aa" strokeWidth={2} dot={{fill: '#2d8a4d'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Order Status Pie Chart */}
            {orderStatus.length > 0 && (
              <div className='bg-white border-2 border-[#b8dce8] rounded-xl p-6 shadow-sm'>
                <h3 className='text-[18px] font-bold text-[#1488aa] mb-4'>Order Status Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={orderStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, value}) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{backgroundColor: 'white', border: '1px solid #b8dce8', borderRadius: '8px'}}
                      labelStyle={{color: '#1488aa'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Best Sellers Bar Chart */}
          {bestSellers.length > 0 && (
            <div className='bg-white border-2 border-[#b8dce8] rounded-xl p-6 shadow-sm'>
              <h3 className='text-[18px] font-bold text-[#1488aa] mb-4'>Top 5 Best Selling Products</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bestSellers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#b8dce8" />
                  <XAxis dataKey="name" stroke="#5a8899" style={{fontSize: '12px'}} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#5a8899" style={{fontSize: '12px'}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: 'white', border: '1px solid #b8dce8', borderRadius: '8px'}}
                    labelStyle={{color: '#1488aa'}}
                    formatter={(value) => `${value} sold`}
                  />
                  <Bar dataKey="quantity" fill="#2d8a4d" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Orders & Best Sellers */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-[20px]'>
            {/* Recent Orders */}
            <div className='bg-white border-2 border-[#b8dce8] rounded-xl p-6 shadow-sm'>
              <h3 className='text-[20px] font-bold text-[#1488aa] mb-4'>Recent Orders</h3>
              <div className='flex flex-col gap-3 max-h-[300px] overflow-y-auto'>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, idx) => (
                    <div key={idx} className='bg-[#f5f9fc] border border-[#b8dce8] rounded-lg p-3 text-[12px] md:text-[13px]'>
                      <div className='flex justify-between items-start gap-2'>
                        <div className='flex-1'>
                          <p className='text-[#0a5f7a]'>{order.address}</p>
                          <p className='text-[#5a8899] text-[11px]'>{order.date}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-[#2d8a4d] font-semibold'>₹{order.amount}</p>
                          <p className={`text-[11px] ${order.status === 'Completed' || order.status === 'completed' ? 'text-[#2d8a4d]' : 'text-[#fbbc04]'}`}>
                            {order.status || 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-[#5a8899]'>No orders yet</p>
                )}
              </div>
            </div>

            {/* Top Products List */}
            <div className='bg-white border-2 border-[#b8dce8] rounded-xl p-6 shadow-sm'>
              <h3 className='text-[20px] font-bold text-[#1488aa] mb-4'>Top Selling Products</h3>
              <div className='flex flex-col gap-3 max-h-[300px] overflow-y-auto'>
                {bestSellers.length > 0 ? (
                  bestSellers.map((product, idx) => (
                    <div key={idx} className='bg-[#f5f9fc] border border-[#b8dce8] rounded-lg p-3 flex justify-between items-center'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white w-[30px] h-[30px] rounded-full flex items-center justify-center font-bold text-[14px]'>
                          {idx + 1}
                        </div>
                        <p className='text-[#0a5f7a] text-[13px]'>{product.name}</p>
                      </div>
                      <p className='text-[#2d8a4d] font-bold text-[14px]'>{product.quantity} sold</p>
                    </div>
                  ))
                ) : (
                  <p className='text-[#5a8899]'>No sales data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Home
