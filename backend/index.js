import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
dotenv.config()
import cors from "cors"
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Message from './model/messageModel.js'

let port = process.env.PORT || 6000

let app = express()
const httpServer = createServer(app)

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true
    }
})

app.use(express.json())
app.use(cookieParser())
app.use(cors({
 origin:["http://localhost:5173" , "http://localhost:5174"],
 credentials:true
}))

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/product",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/order",orderRoutes)
app.use("/api/image",imageRoutes)
app.use("/api/review",reviewRoutes)
app.use("/api/chat",chatRoutes)

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Join a chat room
    socket.on('join-room', (roomId) => {
        socket.join(roomId)
        console.log(`[Backend] User ${socket.id} joined room: ${roomId}`)
        console.log(`[Backend] Room ${roomId} now has ${io.sockets.adapter.rooms.get(roomId)?.size || 0} users`)
    })

    // Handle sending messages
    socket.on('send-message', async (data) => {
        try {
            const { roomId, senderId, senderName, receiverId, message } = data

            console.log('[Backend] Received send-message event')
            console.log('[Backend] Message data:', data)

            // Save message to database
            const newMessage = new Message({
                senderId,
                senderName,
                receiverId,
                message,
                roomId
            })

            await newMessage.save()
            console.log('[Backend] Message saved to DB with ID:', newMessage._id)

            // Emit message to room
            console.log('[Backend] Broadcasting to room:', roomId)
            io.to(roomId).emit('receive-message', {
                _id: newMessage._id,
                senderId,
                senderName,
                receiverId,
                message,
                roomId,
                createdAt: newMessage.createdAt,
                isRead: false
            })
            console.log('[Backend] Message broadcasted successfully')

        } catch (error) {
            console.log('Socket send message error:', error)
        }
    })

    // Handle typing indicator
    socket.on('typing', (data) => {
        socket.to(data.roomId).emit('user-typing', data)
    })

    socket.on('stop-typing', (data) => {
        socket.to(data.roomId).emit('user-stop-typing', data)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
    })
})


httpServer.listen(port,()=>{
    console.log("Hello From Server")
    connectDb()
})


