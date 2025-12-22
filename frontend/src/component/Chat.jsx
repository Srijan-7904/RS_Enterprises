import React, { useState, useEffect, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaComments, FaTimes, FaPaperPlane, FaCircle, FaEllipsisV } from 'react-icons/fa'
import { userDataContext } from '../context/UserContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { io } from 'socket.io-client'

let socket

function Chat() {
  const { userData } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)
  
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const isOpenRef = useRef(isOpen)
  const menuRef = useRef(null)

  const roomId = userData ? `user-${userData._id}` : 'guest'

  // Predefined questions and answers
  const predefinedQA = {
    'Tell me about your company': 'We are a leading e-commerce platform providing quality products and excellent customer service. Our mission is to deliver the best shopping experience to our customers worldwide.',
    'What services do you provide?': 'We offer a wide range of products including clothing, electronics, home items, and more. We also provide fast shipping, easy returns, and 24/7 customer support.',
    'What are the pricing plans?': 'Our pricing varies based on products. We offer competitive prices with regular discounts and promotional offers. Check our product pages for specific pricing details.',
    'How do I place an order?': 'Simply browse our products, add items to your cart, and proceed to checkout. Fill in your shipping and payment details, and your order will be confirmed.',
    'Do you offer customer support?': 'Yes! We offer 24/7 customer support via this chat, email, and phone. Our team is always ready to help with any questions or issues.'
  }

  // Initialize socket connection
  useEffect(() => {
    if (!userData) return

    // Connect to socket server
    socket = io(serverUrl, {
      withCredentials: true
    })

    socket.on('connect', () => {
      console.log('Customer connected to chat server, socket ID:', socket.id)
      setIsConnected(true)
      console.log('[Customer] Joining room:', roomId)
      socket.emit('join-room', roomId)
    })

    socket.on('disconnect', () => {
      console.log('[Customer] Disconnected from chat server')
      setIsConnected(false)
    })

    socket.on('receive-message', (message) => {
      console.log('[Customer] Received message event:', message)
      console.log('[Customer] Expected roomId:', roomId)
      console.log('[Customer] Message roomId:', message.roomId)
      console.log('[Customer] RoomIds match:', message.roomId === roomId)
      
      // Only add if it's for this room
      if (message.roomId === roomId) {
        console.log('[Customer] Adding message to chat')
        // Check if message already exists (for deduplication)
        setMessages(prev => {
          const messageExists = prev.some(msg => 
            msg.senderId === message.senderId && 
            msg.message === message.message &&
            Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 1000
          )
          if (messageExists) {
            console.log('[Customer] Message already exists, skipping duplicate')
            return prev
          }
          return [...prev, message]
        })
        scrollToBottom()
      }
      
      // Update unread count if chat is closed and message is from admin
      if (!isOpenRef.current && message.senderId === 'admin') {
        console.log('[Customer] Incrementing unread count')
        setUnreadCount(prev => prev + 1)
      }
    })

    socket.on('user-typing', (data) => {
      if (data.userId !== userData._id.toString()) {
        setIsTyping(true)
      }
    })

    socket.on('user-stop-typing', () => {
      setIsTyping(false)
    })

    return () => {
      if (socket) socket.disconnect()
    }
  }, [userData, serverUrl, roomId])

  // Sync isOpenRef whenever isOpen changes
  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  // Fetch chat history
  useEffect(() => {
    if (!userData || !isOpen) return

    const fetchHistory = async () => {
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
        console.log('Fetch history error:', error)
      }
    }

    fetchHistory()
  }, [userData, isOpen, roomId, serverUrl])

  // Fetch unread count
  useEffect(() => {
    if (!userData) return

    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/chat/unread`,
          { withCredentials: true }
        )
        if (response.data.success) {
          setUnreadCount(response.data.unreadCount)
        }
      } catch (error) {
        console.log('Fetch unread error:', error)
      }
    }

    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [userData, serverUrl])

  // Mark messages as read when opening chat
  useEffect(() => {
    if (isOpen && userData) {
      const markRead = async () => {
        try {
          await axios.put(
            `${serverUrl}/api/chat/read/${roomId}`,
            {},
            { withCredentials: true }
          )
          setUnreadCount(0)
        } catch (error) {
          console.log('Mark read error:', error)
        }
      }
      markRead()
    }
  }, [isOpen, userData, roomId, serverUrl])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !userData || !socket) return

    const messageData = {
      roomId,
      senderId: userData._id.toString(),
      senderName: userData.name,
      receiverId: 'admin',
      message: newMessage.trim()
    }

    // Add message to local state immediately for UI update
    const tempMessage = {
      _id: Date.now().toString(),
      ...messageData,
      createdAt: new Date(),
      isRead: false
    }
    setMessages(prev => [...prev, tempMessage])
    scrollToBottom()

    console.log('Sending message:', messageData)
    socket.emit('send-message', messageData)
    
    // Auto-respond if it's a predefined question
    if (predefinedQA[newMessage.trim()]) {
      const answer = predefinedQA[newMessage.trim()]
      setTimeout(() => {
        const autoResponse = {
          _id: (Date.now() + 1).toString(),
          roomId,
          senderId: 'admin',
          senderName: 'Support',
          receiverId: userData._id.toString(),
          message: answer,
          createdAt: new Date(),
          isRead: false
        }
        setMessages(prev => [...prev, autoResponse])
        scrollToBottom()
      }, 800) // Delay for natural feel
    }
    
    setNewMessage('')
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    socket.emit('stop-typing', { roomId, userId: userData._id.toString() })
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)
    
    if (!socket || !userData) return

    socket.emit('typing', { roomId, userId: userData._id.toString() })

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { roomId, userId: userData._id.toString() })
    }, 1000)
  }

  if (!userData) return null

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
            className='fixed bottom-[100px] right-[25px] w-[380px] h-[550px] bg-white rounded-lg shadow-2xl z-50 flex flex-col border-2 border-[#b8dce8]'
          >
            {/* Header */}
            <div className='bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] p-[15px] rounded-t-lg flex items-center justify-between'>
              <div className='flex items-center gap-[10px]'>
                <div className='w-[40px] h-[40px] bg-white/20 rounded-full flex items-center justify-center text-white font-bold'>
                  S
                </div>
                <div>
                  <h3 className='text-white font-bold text-[16px]'>Support Chat</h3>
                  <div className='flex items-center gap-[5px]'>
                    <FaCircle className={`text-[8px] ${isConnected ? 'text-green-400' : 'text-gray-400'}`} />
                    <span className='text-white/80 text-[12px]'>
                      {isConnected ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Menu Button */}
              <div className='relative'>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className='text-white hover:bg-white/20 p-[8px] rounded-lg transition-all'
                >
                  <FaEllipsisV className='text-[16px]' />
                </button>
                
                {/* Dropdown Menu */}
                {showMenu && (
                  <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute right-0 top-[40px] bg-white border border-[#b8dce8] rounded-lg shadow-lg z-50'
                  >
                    {messages.length > 0 && (
                      <button
                        onClick={() => {
                          setMessages([])
                          setShowMenu(false)
                        }}
                        className='w-full px-[16px] py-[10px] text-[14px] text-[#0a5f7a] hover:bg-[#e8f4f8] text-left transition-all rounded-t-lg border-b border-[#b8dce8]'
                      >
                        ← Back to Main Menu
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        try {
                          // Clear from backend
                          await axios.delete(
                            `${serverUrl}/api/chat/clear/${roomId}`,
                            { withCredentials: true }
                          )
                          console.log('Chat cleared from backend')
                        } catch (error) {
                          console.log('Clear chat error:', error)
                        }
                        // Clear from local state
                        setMessages([])
                        setShowMenu(false)
                      }}
                      className={`w-full px-[16px] py-[10px] text-[14px] text-[#0a5f7a] hover:bg-[#e8f4f8] text-left transition-all ${messages.length > 0 ? 'rounded-b-lg' : 'rounded-lg'}`}
                    >
                      Clear Chat
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className='flex-1 overflow-y-auto p-[15px] bg-[#f5f9fc] space-y-[10px]'>
              {messages.length === 0 ? (
                <div className='h-full flex flex-col items-center justify-center text-center'>
                  <div>
                    <FaComments className='text-[48px] text-[#b8dce8] mx-auto mb-[10px]' />
                    <p className='text-[#5a8899] text-[14px]'>No messages yet</p>
                    <p className='text-[#5a8899] text-[12px]'>Start a conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = msg.senderId === userData._id.toString()
                  return (
                    <motion.div
                      key={msg._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                    >
                      {!isOwn && <span className='text-[11px] text-[#5a8899] mb-[4px] ml-[4px]'>{msg.senderName || 'Support'}</span>}
                      <div
                        className={`max-w-[75%] px-[12px] py-[8px] rounded-lg ${
                          isOwn
                            ? 'bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white'
                            : 'bg-white text-[#0a5f7a] border border-[#b8dce8]'
                        }`}
                      >
                        <p className='text-[13px] break-words'>{msg.message}</p>
                        <p
                          className={`text-[10px] mt-[4px] ${
                            isOwn ? 'text-white/70' : 'text-[#5a8899]'
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
                })
              )}
              
              {/* Back to Main Menu Button - Shows when messages exist */}
              {messages.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setMessages([])}
                  className='w-full mt-[10px] px-[12px] py-[8px] bg-[#e8f4f8] text-[#1488aa] border border-[#b8dce8] rounded-lg text-[12px] font-semibold hover:bg-[#d0e8f0] transition-all text-center'
                >
                  ← Back to Main Menu
                </motion.button>
              )}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='flex justify-start'
                >
                  <div className='bg-white text-[#5a8899] px-[12px] py-[8px] rounded-lg border border-[#b8dce8]'>
                    <span className='text-[12px]'>Support is typing...</span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions - Always Visible */}
            {messages.length === 0 && (
              <div className='border-t border-[#b8dce8] bg-[#f5f9fc] p-[10px] max-h-[140px] overflow-y-auto'>
                <p className='text-[#5a8899] text-[11px] font-semibold mb-[8px] px-[5px]'>Quick Questions:</p>
                <div className='space-y-[6px]'>
                  {[
                    'Tell me about your company',
                    'What services do you provide?',
                    'What are the pricing plans?',
                    'How do I place an order?',
                    'Do you offer customer support?'
                  ].map((question, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Add question to messages immediately
                        const questionMsg = {
                          _id: Date.now().toString(),
                          roomId,
                          senderId: userData._id.toString(),
                          senderName: userData.name,
                          receiverId: 'admin',
                          message: question,
                          createdAt: new Date(),
                          isRead: false
                        }
                        setMessages(prev => [...prev, questionMsg])
                        
                        // Send to server
                        socket.emit('send-message', {
                          roomId,
                          senderId: userData._id.toString(),
                          senderName: userData.name,
                          receiverId: 'admin',
                          message: question
                        })
                        
                        // Auto-respond with answer
                        if (predefinedQA[question]) {
                          const answer = predefinedQA[question]
                          setTimeout(() => {
                            const autoResponse = {
                              _id: (Date.now() + 1).toString(),
                              roomId,
                              senderId: 'admin',
                              senderName: 'Support',
                              receiverId: userData._id.toString(),
                              message: answer,
                              createdAt: new Date(),
                              isRead: false
                            }
                            setMessages(prev => [...prev, autoResponse])
                            scrollToBottom()
                          }, 800)
                        }
                        
                        scrollToBottom()
                      }}
                      className='w-full px-[10px] py-[6px] bg-white text-[#0a5f7a] border border-[#b8dce8] rounded-md text-[11px] hover:bg-[#e8f4f8] hover:border-[#1488aa] transition-all text-left'
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className='p-[15px] border-t border-[#b8dce8]'>
              <div className='flex gap-[10px]'>
                <input
                  type='text'
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder='Type a message...'
                  className='flex-1 px-[12px] py-[10px] border-2 border-[#b8dce8] rounded-lg bg-white text-[#0a5f7a] placeholder-[#5a8899] focus:outline-none focus:border-[#1488aa] text-[14px]'
                />
                <motion.button
                  type='submit'
                  disabled={!newMessage.trim() || !isConnected}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='w-[45px] h-[45px] bg-gradient-to-r from-[#1488aa] to-[#2d8a4d] text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all'
                >
                  <FaPaperPlane className='text-[16px]' />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chat
