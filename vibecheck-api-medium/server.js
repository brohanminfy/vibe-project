import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/db.js'
import User from './models/User.js'
import Vibe from './models/Vibe.js'
import mongoose from 'mongoose'
const app = express()
dotenv.config()
app.use(express.json())
dbConnect()
app.post('/register',async (req,res)=>{
    const {name,email,password} = req.body
    const newUser = await User.create({name:name,email:email,password:password})

})
const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`listening ${PORT}`)
})