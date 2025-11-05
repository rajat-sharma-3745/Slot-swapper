import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import swapRoutes from './routes/swapRoutes.js'
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';


dotenv.config();


const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Welcome to SlotSwapper');
})


app.use('/api/users',userRoutes);
app.use('/api/events',eventRoutes);
app.use('/api',swapRoutes);




app.use(errorMiddleware)
connectDb().then(()=>{
    app.listen(PORT,()=>console.log('Server Running on port',PORT))
})