import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
import authRoutes from './routes/auth.Routes.js';
import userRoutes from './routes/user.Routes.js';
import adminRoutes from './routes/admin.Routes.js';

app.use(cookieParser())
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : ['process.env.API_URL', 'process.env.API_URL'],
    credentials: true
}));
app.use(express.json({ limit: '15mb' }));

app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/admin',adminRoutes)

export default app;