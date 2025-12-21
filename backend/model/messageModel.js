import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String, // Can be ObjectId string or 'admin'
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    receiverId: {
        type: String, // 'admin' or userId
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    roomId: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Index for faster queries
messageSchema.index({ roomId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
