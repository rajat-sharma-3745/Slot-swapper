import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import { sendToken } from "../utils/feature.js";

export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    if ([name, email, password].some(el => el?.trim() === "")) {
        return next(new ApiError('All fields are required', 400))
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ApiError("User already exists", 400))
    }
    user = await User.create({ name, email, password });
    sendToken(res, user, 201, "Registered successfully");
})
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if ([email, password].some(el => el?.trim() === "")) {
        return next(new ApiError('All fields are required', 400))
    }
    const user = await User.findOne({ email });

    if (!user) return next(new ApiError("Invalid credentials", 400))
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new ApiError("Invalid credentials", 400))
    sendToken(res, user, 200, "Logged in successfully")
})