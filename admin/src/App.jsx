import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Add from './pages/Add'
import Lists from './pages/Lists'
import EditProduct from './pages/EditProduct'
import Orders from './pages/Orders'
import Login from './pages/Login'
import ImageGenerator from './pages/ImageGenerator'
import ChatAdmin from './pages/ChatAdmin'
import ChatToggle from './component/ChatToggle'
import { adminDataContext } from './context/AdminContext'
  import { ToastContainer, toast } from 'react-toastify';

function App() {
  let {adminData} = useContext(adminDataContext)
  return (

    <>
      <ToastContainer />
    {!adminData ? <Login/> : <>
      <ChatToggle />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/add' element={<Add/>}/>
        <Route path='/lists' element={<Lists/>}/>
        <Route path='/list' element={<Lists/>}/>
        <Route path='/edit-product' element={<EditProduct/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/image-generator' element={<ImageGenerator/>}/>
        <Route path='/chat' element={<ChatAdmin/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
      </>
      }
    </>
  )
}

export default App
