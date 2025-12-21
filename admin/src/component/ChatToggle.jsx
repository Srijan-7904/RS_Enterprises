import React, { useState, useEffect, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaComments, FaTimes, FaPaperPlane, FaCircle, FaUser } from 'react-icons/fa'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { io } from 'socket.io-client'

let socket

function ChatToggle() {
  const { serverUrl } = useContext(authDataContext)
  
  const [isOpen, setIsOpen] = useState(false)
  const [chatRooms, setChatRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const activeRoomRef = useRef(null)

  // Initialize socket connection
  useEffect(() => {
    socket = io(serverUrl, {
      withCredentials: true
    })

    socket.on('connect', () => {
      console.log('Admin connected to chat server, socket ID:', socket.id)
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Admin disconnected from chat server')
      setIsConnected(false)
    })

    socket.on('receive-message', (message) => {
      console.log('[Admin] Received message event:', message)
      console.log('[Admin] Active room ref:', activeRoomRef.current)
      console.log('[Admin] Message roomId matches:', message.roomId === activeRoomRef.current)
      if (activeRoomRef.current && message.roomId === activeRoomRef.current) {
        console.log('[Admin] Adding message to active room')
        // Check if message already exists (for deduplication)
        setMessages(prev => {
          const messageExists = prev.some(msg => 
            msg.senderId === message.senderId && 
            msg.message === message.message &&
            Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 1000
          )
          if (messageExists) {
            console.log('[Admin] Message already exists, skipping duplicate')
            return prev
          }
          return [...prev, message]
        })
        scrollToBottom()
      }
      fetchChatRooms()
    })

    socket.on('user-typing', (data) => {
      if (activeRoomRef.current && data.roomId === activeRoomRef.current) {
        setIsTyping(true)
      }
    })

    socket.on('user-stop-typing', () => {
      setIsTyping(false)
    })

    return () => {
      if (socket) socket.disconnect()
    }
  }, [serverUrl])

  // Fetch all chat rooms
  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/chat/admin/rooms`,
        { withCredentials: true }
      )
      if (response.data.success) {
        setChatRooms(response.data.rooms)
        const unread = response.data.rooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0)
        setUnreadCount(unread)
      }
    } catch (error) {
      console.log('Fetch chat rooms error:', error)
    }
  }

  useEffect(() => {
    fetchChatRooms()
    const interval = setInterval(fetchChatRooms, 30000)
    return () => clearInterval(interval)
  }, [])

  // Fetch messages for selected room
  const selectRoom = async (roomId) => {
    setActiveRoom(roomId)
    activeRoomRef.current = roomId
    
    if (socket) {
      socket.emit('join-room', roomId)
      console.log('Joined room:', roomId)
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
    
    console.log('[Admin] handleSendMessage called')
    
    if (!newMessage.trim()) {
      console.log('[Admin] Message is empty')
      return
    }
    
    if (!activeRoom) {
      console.log('[Admin] No active room selected')
      return
    }
    
    if (!socket || !socket.connected) {
      console.log('[Admin] Socket not connected:', socket?.connected)
      return
    }

    const messageData = {
      roomId: activeRoom,
      senderId: 'admin',
      senderName: 'Support',
      receiverId: activeRoom.replace('user-', ''),
      message: newMessage.trim()
    }

    console.log('[Admin] Sending message to roomId:', messageData.roomId)
    console.log('[Admin] Full message data:', messageData)
    
    // Add message to local state immediately for UI update
    const tempMessage = {
      _id: Date.now().toString(),
      ...messageData,
      createdAt: new Date(),
      isRead: false
    }
    setMessages(prev => [...prev, tempMessage])
    scrollToBottom()
    
    console.log('[Admin] Emitting send-message event')
    socket.emit('send-message', messageData)
    setNewMessage('')
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    socket.emit('stop-typing', { roomId: activeRoom, userId: 'admin' })
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)
    
    if (!socket || !activeRoom) return

    socket.emit('typing', { roomId: activeRoom, userId: 'admin' })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { roomId: activeRoom, userId: 'admin' })
    }, 1000)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-[25px] right-[25px] z-50 w-[60px] h-[60px] bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-[0_0_30px_rgba(20,136,170,0.5)] transition-all'
      >
        {isOpen ? (
          <FaTimes className='text-[24px]' />
        ) : (
          <>
            <FaComments className='text-[28px]' />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='absolute -top-[5px] -right-[5px] w-[24px] h-[24px] bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center'
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='fixed bottom-[100px] right-[25px] w-[700px] h-[550px] bg-white rounded-lg shadow-2xl z-50 flex border-2 border-[#b8dce8]'
          >
            {/* Customer List */}
            <div className='w-[40%] border-r-2 border-[#b8dce8] flex flex-col'>
              <div className='bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] p-[15px]'>
                <h3 className='text-white font-bold text-[16px]'>Customer Chats</h3>
                <div className='flex items-center gap-[5px] mt-[5px]'>
                  <FaCircle className={`text-[8px] ${isConnected ? 'text-green-400' : 'text-gray-400'}`} />
                  <span className='text-white/80 text-[12px]'>
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              <div className='flex-1 overflow-y-auto bg-[#f5f9fc]'>
                {chatRooms.length === 0 ? (
                  <div className='flex items-center justify-center h-full text-center p-[20px]'>
                    <p className='text-[#5a8899] text-[14px]'>No active chats</p>
                  </div>
                ) : (
                  chatRooms.map((room) => (
                    <div
                      key={room._id}
                      onClick={() => selectRoom(room._id)}
                      className={`p-[15px] border-b border-[#b8dce8] cursor-pointer hover:bg-white transition-colors ${
                        activeRoom === room._id ? 'bg-white border-l-4 border-l-[#1488aa]' : ''
                      }`}
                    >
                      <div className='flex items-center justify-between mb-[5px]'>
                        <div className='flex items-center gap-[10px]'>
                          <div className='w-[35px] h-[35px] bg-gradient-to-br from-[#1488aa] to-[#2d8a4d] text-white rounded-full flex items-center justify-center font-bold text-[14px]'>
                            {room.userName?.charAt(0).toUpperCase()}
                          </div>
                          <h4 className='text-[14px] font-bold text-[#0a5f7a]'>{room.userName}</h4>
                        </div>
                        {room.unreadCount > 0 && (
                          <span className='bg-red-500 text-white text-[10px] font-bold px-[6px] py-[2px] rounded-full'>
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className='text-[#5a8899] text-[12px] truncate'>{room.lastMessage}</p>
                      <p className='text-[#5a8899] text-[10px] mt-[3px]'>
                        {new Date(room.lastMessageTime).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className='flex-1 flex flex-col'>
              {activeRoom ? (
                <>
                  <div className='bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] p-[15px]'>
                    <h3 className='text-white font-bold text-[16px]'>
                      {chatRooms.find(r => r._id === activeRoom)?.userName || 'Customer'}
                    </h3>
                  </div>

                  <div className='flex-1 overflow-y-auto p-[15px] bg-[#f5f9fc] space-y-[10px]'>
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
                            className={`max-w-[75%] px-[12px] py-[8px] rounded-lg ${
                              isAdmin
                                ? 'bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white'
                                : 'bg-white text-[#0a5f7a] border border-[#b8dce8]'
                            }`}
                          >
                            <p className='text-[13px] break-words'>{msg.message}</p>
                            <p
                              className={`text-[10px] mt-[4px] ${
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
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='flex justify-start'
                      >
                        <div className='bg-white text-[#5a8899] px-[12px] py-[8px] rounded-lg border border-[#b8dce8]'>
                          <span className='text-[12px]'>Customer is typing...</span>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className='p-[15px] border-t border-[#b8dce8]'>
                    <div className='flex gap-[10px]'>
                      <input
                        type='text'
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder='Type a message...'
                        className='flex-1 px-[12px] py-[10px] border-2 border-[#b8dce8] rounded-lg focus:outline-none focus:border-[#1488aa] text-[#0a5f7a]'
                      />
                      <motion.button
                        type='submit'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-[20px] py-[10px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white rounded-lg font-bold hover:shadow-lg'
                      >
                        <FaPaperPlane />
                      </motion.button>
                    </div>
                  </form>
                </>
              ) : (
                <div className='flex-1 flex items-center justify-center bg-[#f5f9fc]'>
                  <div className='text-center'>
                    <FaComments className='text-[64px] text-[#b8dce8] mx-auto mb-[15px]' />
                    <p className='text-[#5a8899] text-[16px]'>Select a chat to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatToggle
