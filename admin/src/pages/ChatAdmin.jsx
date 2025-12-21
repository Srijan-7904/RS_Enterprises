import React, { useState, useEffect, useContext, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaPaperPlane, FaCircle, FaUser } from 'react-icons/fa'
import { adminDataContext } from '../context/AdminContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { io } from 'socket.io-client'

let socket

function ChatAdmin() {
  const { serverUrl } = useContext(authDataContext)
  
  const [chatRooms, setChatRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Initialize socket connection
  useEffect(() => {
    socket = io(serverUrl, {
      withCredentials: true
    })

    socket.on('connect', () => {
      console.log('Admin connected to chat server')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Admin disconnected from chat server')
      setIsConnected(false)
    })

    socket.on('receive-message', (message) => {
      // Update messages if in active room
      if (activeRoom && message.roomId === activeRoom) {
        setMessages(prev => [...prev, message])
        scrollToBottom()
      }
      
      // Refresh chat rooms to show new message
      fetchChatRooms()
    })

    socket.on('user-typing', (data) => {
      if (activeRoom && data.roomId === activeRoom) {
        setIsTyping(true)
      }
    })

    socket.on('user-stop-typing', () => {
      setIsTyping(false)
    })

    return () => {
      if (socket) socket.disconnect()
    }
  }, [serverUrl, activeRoom])

  // Fetch all chat rooms
  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/chat/admin/rooms`,
        { withCredentials: true }
      )
      if (response.data.success) {
        setChatRooms(response.data.rooms)
      }
    } catch (error) {
      console.log('Fetch chat rooms error:', error)
    }
  }

  useEffect(() => {
    fetchChatRooms()
    const interval = setInterval(fetchChatRooms, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  // Fetch messages for selected room
  const selectRoom = async (roomId) => {
    setActiveRoom(roomId)
    
    // Join socket room
    if (socket) {
      socket.emit('join-room', roomId)
    }

    try {
      const response = await axios.get(
        `${serverUrl}/api/chat/history/${roomId}`,
        { withCredentials: true }
      )
      if (response.data.success) {
        setMessages(response.data.messages)
        scrollToBottom()
      }
    } catch (error) {
      console.log('Fetch messages error:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (!newMessage.trim()) {
      console.log('Message is empty')
      return
    }
    
    if (!activeRoom) {
      console.log('No active room selected')
      return
    }
    
    if (!socket || !socket.connected) {
      console.log('Socket not connected:', socket?.connected)
      return
    }

    const messageData = {
      roomId: activeRoom,
      senderId: 'admin',
      senderName: 'Support',
      receiverId: activeRoom.replace('user-', ''),
      message: newMessage.trim()
    }

    console.log('Sending message:', messageData)
    
    // Add message to local state immediately for UI update
    const tempMessage = {
      _id: Date.now().toString(),
      ...messageData,
      createdAt: new Date(),
      isRead: false
    }
    setMessages(prev => [...prev, tempMessage])
    scrollToBottom()
    
    socket.emit('send-message', messageData)
    setNewMessage('')
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    socket.emit('stop-typing', { roomId: activeRoom, userId: 'admin' })
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)
    
    if (!socket || !activeRoom) return

    socket.emit('typing', { roomId: activeRoom, userId: 'admin' })

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { roomId: activeRoom, userId: 'admin' })
    }, 1000)
  }

  return (
    <div className='min-h-screen bg-gradient-to-l from-[#f5f9fc] to-[#e8f4f8] p-[20px]'>
      <div className='max-w-[1400px] mx-auto'>
        <div className='bg-white rounded-lg shadow-lg border-2 border-[#b8dce8] overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] p-[20px]'>
            <div className='flex items-center justify-between'>
              <h1 className='text-[28px] font-bold text-white'>Customer Support Chat</h1>
              <div className='flex items-center gap-[8px]'>
                <FaCircle className={`text-[10px] ${isConnected ? 'text-green-400' : 'text-gray-400'}`} />
                <span className='text-white text-[14px]'>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-200px)]'>
            {/* Chat Rooms List */}
            <div className='border-r-2 border-[#b8dce8] bg-[#f5f9fc] overflow-y-auto'>
              <div className='p-[15px] border-b-2 border-[#b8dce8]'>
                <h2 className='text-[18px] font-bold text-[#0a5f7a]'>Active Chats ({chatRooms.length})</h2>
              </div>
              
              {chatRooms.length === 0 ? (
                <div className='p-[20px] text-center text-[#5a8899]'>
                  <p>No active chats</p>
                </div>
              ) : (
                chatRooms.map((room) => (
                  <motion.div
                    key={room._id}
                    whileHover={{ backgroundColor: '#e8f4f8' }}
                    onClick={() => selectRoom(room._id)}
                    className={`p-[15px] border-b border-[#b8dce8] cursor-pointer transition-all ${
                      activeRoom === room._id ? 'bg-[#e8f4f8] border-l-4 border-l-[#1488aa]' : ''
                    }`}
                  >
                    <div className='flex items-center gap-[12px]'>
                      <div className='w-[45px] h-[45px] bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] text-white rounded-full flex items-center justify-center font-bold'>
                        <FaUser />
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-[15px] font-bold text-[#0a5f7a]'>User {room._id.replace('user-', '').slice(0, 8)}</h3>
                        <p className='text-[12px] text-[#5a8899] truncate'>{room.lastMessage}</p>
                        <p className='text-[10px] text-[#5a8899] mt-[2px]'>
                          {new Date(room.lastMessageTime).toLocaleString()}
                        </p>
                      </div>
                      {room.unreadCount > 0 && (
                        <div className='w-[24px] h-[24px] bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center'>
                          {room.unreadCount}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Chat Messages */}
            <div className='col-span-2 flex flex-col'>
              {!activeRoom ? (
                <div className='flex-1 flex items-center justify-center bg-[#f5f9fc]'>
                  <div className='text-center'>
                    <FaPaperPlane className='text-[64px] text-[#b8dce8] mx-auto mb-[15px]' />
                    <p className='text-[#5a8899] text-[18px] font-semibold'>Select a chat to start messaging</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages Area */}
                  <div className='flex-1 overflow-y-auto p-[20px] bg-[#f5f9fc] space-y-[12px]'>
                    {messages.map((msg, index) => {
                      const isAdmin = msg.senderId === 'admin'
                      return (
                        <motion.div
                          key={msg._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-[15px] py-[10px] rounded-lg ${
                              isAdmin
                                ? 'bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white'
                                : 'bg-white text-[#0a5f7a] border-2 border-[#b8dce8]'
                            }`}
                          >
                            <p className='text-[11px] font-bold mb-[4px] opacity-70'>
                              {msg.senderName}
                            </p>
                            <p className='text-[14px] break-words'>{msg.message}</p>
                            <p
                              className={`text-[11px] mt-[6px] ${
                                isAdmin ? 'text-white/70' : 'text-[#5a8899]'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='flex justify-start'
                      >
                        <div className='bg-white text-[#5a8899] px-[15px] py-[10px] rounded-lg border-2 border-[#b8dce8]'>
                          <span className='text-[13px]'>User is typing...</span>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <form onSubmit={handleSendMessage} className='p-[20px] border-t-2 border-[#b8dce8] bg-white'>
                    <div className='flex gap-[12px]'>
                      <input
                        type='text'
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder='Type your message...'
                        className='flex-1 px-[16px] py-[12px] border-2 border-[#b8dce8] rounded-lg bg-[#f5f9fc] text-[#0a5f7a] placeholder-[#5a8899] focus:outline-none focus:border-[#1488aa] text-[15px]'
                      />
                      <motion.button
                        type='submit'
                        disabled={!newMessage.trim() || !isConnected}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-[25px] py-[12px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white font-bold rounded-lg flex items-center gap-[8px] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all'
                      >
                        <FaPaperPlane />
                        Send
                      </motion.button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatAdmin
