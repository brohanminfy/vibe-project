import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/db.js'
// import User from './models/User.js'
// import Vibe from './models/Vibe.js'
// import mongoose from 'mongoose'
// import {} from './controller/userControllar.js'
import router from './routes/UserVibeRouter.js'

const app = express()
dotenv.config()
app.use(express.json())
dbConnect()

const PORT = process.env.PORT || 3000

app.use('/api/v1/auth',router)
app.use('/api/v1',router)

app.listen(PORT,()=>{
    console.log(`listening ${PORT}`)
})