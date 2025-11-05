import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../controllers/eventController.js";


const router = Router();


router.get('/',auth,getEvents)
router.post('/',auth,createEvent)
router.patch('/:id',auth,updateEvent)
router.delete('/:id',auth,deleteEvent)



export default router