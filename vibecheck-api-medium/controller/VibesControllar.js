import z from 'zod'
import bcrypt,{hash} from 'bcrypt'
import jwt from 'jsonwebtoken'
import Vibes from '../models/Vibe'
import auth from '../middleware/auth'
import Vibe from '../models/Vibe'


const vibeMessageValidation = z.object({
    vibeMessage:z.string().max(100,{message:"Message should be less than 100 characters"})
})
const validateMessage =(vibeMessage,res)=>{
    try{
        const _messageValidation = vibeMessageValidation.safeParse({vibeMessage})
        if(!_messageValidation.success){
            return res.status(400).json({success:false,"message":"Vibe message exceeded 100 characters"})
        }
        return {success:true,"message":"Validation Done"}
    }catch(e){
        console.log(e)
        return res.status(500).json({success:false,"message":"Internal error"})
    }
    
}

export const postVibe =async (req,res)=>{
    try{
    const {message}= req.body
    console.log(message)
    console.log(validateMessage(message,res))
    const userDetails = req.user
    if(!userDetails){
       return res.status(401).json({"message":"User Details not found"})
    }
    console.log(userDetails)
    const verifyExisting = await Vibe.findOne({"author":userDetails["_id"]})
    if(verifyExisting){
        const updateVibe = await Vibe.updateOne({"author":userDetails["_id"],$set :{"vibeMessage":message}})
        return res.status(201).json({"message":"Vibe message updated"})
    }
    else{
    const vibingData = await Vibe.create({"vibeMessage":message,author:userDetails["_id"]})
    console.log(vibingData)
    return res.status(200).json({"message":"Vibe saved successfully"})
    }
    }catch(e){
        console.log(e)
    }
}
export const getVibe = async (req,res)=>{
    try{
        const vibes = await Vibe.find().populate('author','name')
        return res.status(200).json({
            success:true,
            data: vibes
        });
    }catch(e){
        res.status(500).json({success:false,message:"Internal error"+e})
        console.log(e)
    }
}

export const like = async (req,res)=>{
    try{
        const vibeId = req.params.id
        const userDetails = req.user
        console.log(userDetails)
        const {likes} = await Vibe.findById(vibeId)
        console.log(likes)
        console.log(userDetails["_id"])
        const found = likes.find((like)=>{
            return userDetails["_id"].toString()===like.toString()
        })
        console.log(found)
        if(found){
            const removeLike = await Vibe.updateOne(
                {"_id":vibeId },
                {$pull:{likes:userDetails["_id"]}}
        )
        return res.status(200).json({success:true,message:"Like removed successfully"})
        }
        else{
            const addLike = await Vibe.updateOne(
                {"_id":vibeId},
                {$push:{likes:userDetails["_id"]}}
            )
        return res.status(200).json({success:true,message:"Like added successfully"})
        }
    }catch(e){

    }
}