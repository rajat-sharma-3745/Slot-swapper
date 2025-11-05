import Event from "../models/Event.js"
import SwapRequest from "../models/SwapRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/errorHandler.js";

export const getSwappableSlots = asyncHandler(async (req, res, next) => {
    const slots = await Event.find({ status: 'SWAPPABLE', userId: { $ne: req.user._id } }).populate('userId', 'name email');
    res.json(slots);
})
export const createSwapRequest = asyncHandler(async (req, res, next) => {
    const { mySlotId, theirSlotId } = req.body;
    const [mySlot, theirSlot] = await Promise.all([Event.findOne({ _id: mySlotId, userId: req.user._id, status: "SWAPPABLE" }), Event.findOne({ _id: theirSlotId, status: "SWAPPABLE" })])
    if (!mySlot || !theirSlot) {
        return next(new ApiError('Slots either does not exist or not swappable'));
    }
    const swapRequest = await SwapRequest.create({ mySlotId, theirSlotId, fromUser: req.user._id, toUser: theirSlot.userId, status: 'PENDING' });
    mySlot.status = "SWAP_PENDING"
    theirSlot.status = "SWAP_PENDING"
    await Promise.all([mySlot.save(), theirSlot.save()])
    res.status(201).json({
        message: "Swap request created successfully",
        swapRequest
    });
})

export const getSwapRequests = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const incoming = await SwapRequest.find({ toUser: userId,status:"PENDING" })
    .populate("fromUser", "name email")
    .populate("mySlotId")
    .populate("theirSlotId");

  const outgoing = await SwapRequest.find({ fromUser: userId })
    .populate("toUser", "name email")
    .populate("mySlotId")
    .populate("theirSlotId");

  res.status(200).json({
    incoming: incoming.map((r) => ({
      _id: r._id,
      fromUser: r.fromUser,
      mySlot: r.theirSlotId,
      theirSlot: r.mySlotId,
      status: r.status,
    })),
    outgoing: outgoing.map((r) => ({
      _id: r._id,
      toUser: r.toUser,
      mySlot: r.mySlotId,
      theirSlot: r.theirSlotId,
      status: r.status,
    })),
  });
});




export const respondToSwapRequest = asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const { accept } = req.body;
    const swapRequest = await SwapRequest.findById(requestId)
    if (!swapRequest) {
        return next(new ApiError('Swap request not found', 404));
    }

    if (swapRequest.toUser.toString() !== req.user._id.toString()) {
        return next(new ApiError('Not authorized to respond to this request', 403))
    }
    const { mySlotId, theirSlotId } = swapRequest
    const [mySlot, theirSlot] = await Promise.all([Event.findById(mySlotId), Event.findById(theirSlotId)])
    if (!mySlot || !theirSlot) {
        return next(new ApiError('One or both slots not found', 404));
    }
    if (!accept) {
        swapRequest.status = 'REJECTED';
        mySlot.status = "SWAPPABLE"
        theirSlot.status = "SWAPPABLE"
    } else {
        swapRequest.status = 'ACCEPTED';
        const tempUser = mySlot.userId;
        mySlot.userId = theirSlot.userId;
        theirSlot.userId = tempUser;
        mySlot.status = "BUSY"
        theirSlot.status = "BUSY"

    }
    await Promise.all([mySlot.save(), theirSlot.save(), swapRequest.save()])
    res.status(200).json({
        message: `Swap request ${accept ? 'accepted' : 'rejected'}`,
        swapRequest
    });
})