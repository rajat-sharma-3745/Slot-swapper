import Event from "../models/Event.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";

export const getEvents = asyncHandler(async (req, res, next) => {
    const events = await Event.find({ userId: req.user.id });
    if (!events) return next(new ApiError('Error fetching events', 500))
    res.json(events);
})
export const createEvent = asyncHandler(async (req, res, next) => {
    const { title, startTime, endTime } = req.body;
    const event = new Event({
        title,
        startTime,
        endTime,
        userId: req.user._id
    });
    await event.save();
    res.status(201).json(event);
})
export const updateEvent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; 

    const event = await Event.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { status },
        { new: true }
    );

    if (!event) return next(new ApiError('Event not found', 404));
    res.json(event);
})
export const deleteEvent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const event = await Event.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!event) return next(new ApiError('Event not found', 404))
    res.json({ message: 'Event deleted successfully' });
})