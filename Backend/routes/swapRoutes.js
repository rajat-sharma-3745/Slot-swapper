import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { createSwapRequest, getSwappableSlots, getSwapRequests, respondToSwapRequest } from "../controllers/swapController.js";


const router = Router();


router.get('/swappable-slots', auth, getSwappableSlots);
router.post('/swap-request', auth, createSwapRequest);
router.get("/swap-requests", auth, getSwapRequests); 
router.patch('/swap-response/:requestId', auth, respondToSwapRequest);



export default router;