import express from 'express';
import { 
    getChatHistory, 
    markAsRead, 
    getUnreadCount,
    getUserChatRooms,
    getAdminChatRooms,
    clearChatHistory
} from '../controller/chatController.js';
import isAuth from '../middleware/isAuth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Get chat history for a room
router.get('/history/:roomId', getChatHistory);

// Mark messages as read
router.put('/read/:roomId', isAuth, markAsRead);

// Get unread message count
router.get('/unread', isAuth, getUnreadCount);

// Clear chat history
router.delete('/clear/:roomId', clearChatHistory);

// Get all chat rooms for user
router.get('/rooms', isAuth, getUserChatRooms);

// Get all chat rooms for admin
router.get('/admin/rooms', adminAuth, getAdminChatRooms);

export default router;
