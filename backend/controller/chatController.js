import Message from "../model/messageModel.js";

// Get chat history for a room
export const getChatHistory = async (req, res) => {
    try {
        const { roomId } = req.params;

        const messages = await Message.find({ roomId })
            .sort({ createdAt: 1 })
            .limit(100); // Last 100 messages

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.log("Get chat history error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user._id.toString();

        // Mark all messages in this room where current user is receiver as read
        await Message.updateMany(
            { roomId, receiverId: userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: "Messages marked as read"
        });

    } catch (error) {
        console.log("Mark as read error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        const unreadCount = await Message.countDocuments({
            receiverId: userId,
            isRead: false
        });

        res.status(200).json({
            success: true,
            unreadCount
        });

    } catch (error) {
        console.log("Get unread count error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all chat rooms for a user
export const getUserChatRooms = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        // Get unique room IDs where user is sender or receiver
        const rooms = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: req.user._id },
                        { receiverId: userId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$roomId",
                    lastMessage: { $first: "$message" },
                    lastMessageTime: { $first: "$createdAt" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $eq: ["$receiverId", userId] },
                                    { $eq: ["$isRead", false] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            rooms
        });

    } catch (error) {
        console.log("Get chat rooms error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all chat rooms for admin
export const getAdminChatRooms = async (req, res) => {
    try {
        // Get all unique room IDs with their latest messages
        const rooms = await Message.aggregate([
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$roomId",
                    senderName: { $first: "$senderName" },
                    lastMessage: { $first: "$message" },
                    lastMessageTime: { $first: "$createdAt" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $eq: ["$receiverId", "admin"] },
                                    { $eq: ["$isRead", false] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        // Map senderName to userName for frontend compatibility
        const formattedRooms = rooms.map(room => ({
            ...room,
            userName: room.senderName || 'Customer'
        }));

        res.status(200).json({
            success: true,
            rooms: formattedRooms
        });

    } catch (error) {
        console.log("Get admin chat rooms error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Clear chat history for a room
export const clearChatHistory = async (req, res) => {
    try {
        const { roomId } = req.params;

        await Message.deleteMany({ roomId });

        res.status(200).json({
            success: true,
            message: "Chat history cleared"
        });

    } catch (error) {
        console.log("Clear chat history error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
