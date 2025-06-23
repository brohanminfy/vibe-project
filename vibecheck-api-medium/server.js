import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/db.js'
// import User from './models/User.js'
// import Vibe from './models/Vibe.js'
// import mongoose from 'mongoose'
// import {} from './controller/userControllar.js'
import router from './routes/UserVibeRouter.js'
import commentrouter from './routes/comments.js'
import errorHandler from './middleware/error.js'
import fs from 'fs'
import path from 'path'

const app = express()
dotenv.config()
app.use(express.json())
dbConnect()

const PORT = process.env.PORT || 3000

const logStream = fs.createWriteStream(path.join('logs', 'app.log'), { flags: 'a' });
app.use((req, res, next) => {
    const logEntry = {
        time: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        user: req.user ? req.user._id : null
    };
    logStream.write(JSON.stringify(logEntry) + '\n');
    next();
});

app.use('/api/v1/auth',router)
app.use('/api/v1',router)
app.use('/api/v1',commentrouter)
app.use(errorHandler)
app.listen(PORT,()=>{
    console.log(`listening ${PORT}`)
})