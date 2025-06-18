import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const sampleVibe = [
    {id:1,name:"rohan",vibeText:"YoYo"},
    {id:2,name:"Sai",vibeText:"YeaYea"},
    {id:3,name:"Bro",vibeText:"Huffff"}
]
    


app.use(express.json())

app.get('/',(req,res)=>{
    res.status(200).send("Welcome SpiderMan")
})

app.get('/api/v1/vibes',(req,res)=>{
    res.status(200).json(sampleVibe)
})

app.get('/api/v1/vibes/:id',(req,res)=>{
    const len = sampleVibe.length
    try{
    const _id =parseInt(req.params.id)
    if(_id>len){
        res.status(404).json({ "success": false, "message": "That vibe is off the grid, not found." })
    }
    else{
       const getvibe = sampleVibe.find((vibe)=>{
        return _id==vibe["id"]
       })
        res.status(200).json(getvibe)
    }}catch(e){
        console.log(`internal error ${e}`)
    }
})

const PORT = process.env.PORT || 3000


app.listen(PORT,()=>{
    console.log(`🚀 Server blasting off on port ${PORT}`)
})
