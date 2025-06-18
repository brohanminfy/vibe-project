import z from 'zod'
import bcrypt,{hash} from 'bcrypt'
import jwt from 'jsonwebtoken'
import Vibes from '../models/Vibe'
import auth from '../middleware/auth'


const vibeMessageValidation = z.object({
    vibeMessage:z.string().max(100,{message:"Message should be less than 100 characters"})
})
const validateMessage =(message,res)=>{
    try{
        const _messageValidation = vibeMessageValidation.safeParse(message)
        if(!_messageValidation.success){
            return res.status(400).json({success:false,"message":"Vibe message exceeded 100 characters"})
        }
        return res.status(200).json({success:true,"message":"Validation Done"})
    }catch(e){
        console.log(e)
        res.status(500).json({success:false,"message":"Internal error"})
    }
}

export const postVibe =async (req,res)=>{
    const {validateMessage} = req.body
    const result = req.user
    console.log(result)
}


