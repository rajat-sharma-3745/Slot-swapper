import mongoose, { Schema } from "mongoose";

const swapRequestSchema = new Schema({
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // requester
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   // receiver
    mySlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    theirSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export default mongoose.model('SwapRequest', swapRequestSchema);