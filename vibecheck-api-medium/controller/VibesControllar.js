import z from 'zod'
import bcrypt,{hash} from 'bcrypt'
import jwt from 'jsonwebtoken'
import Vibes from '../models/Vibe'
import auth from '../middleware/auth'
import Vibe from '../models/Vibe'
import comments from '../models/Comment'


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
export const getVibe = async (req, res) => {
    try {
        let { limit = 10, page = 1 } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        const skip = (page - 1) * limit;

        const total = await Vibe.countDocuments();
        const vibes = await Vibe.find()
            .populate('author', 'name')
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        const hasNext = skip + vibes.length < total;
        const pagination = {
            next: hasNext ? { page: page + 1, limit } : null,
            total,
            page,
            limit
        };

        return res.status(200).json({
            success: true,
            data: vibes,
            pagination
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal error" + e });
        console.log(e);
    }
};

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

export const postcomment = async(req,res)=>{
    try{
        const vibeId = req.params.id
        const result = req.body
        const user = req.user
        // console.log(vibeId,result,user)
        if(!vibeId || !result || !user){
            return res.status(400).json({"success":false,"Message":"insufficient info"})
        }

        const createComment = await comments.create({"comment":result.comment,"user":user["_id"],"vibe":vibeId})
        console.log(createComment)
        res.status(200).json({"success":true,"Message":"Comment added successfully"})
    }catch(e){
        res.status(500).json({"success":false,"Message":"Internal server issue"})
    }
}

export const getcomments = async (req,res)=>{
try{
    const vibe_id = req.params.id
    if(!vibe_id){
       return res.status(400).json({"success":false,"message":"Id not provided"})
    }
    const check_VibeId = await Vibe.findById(vibe_id)
    if(!check_VibeId){
       return res.status(400).json({"success":false,"Message":"No vibe found with id"})
    }
    const result = await comments.find({"vibe":vibe_id}).populate("user","name").populate("vibe","vibeMessage")
    if(!result){
        return res.status(200).json({"success":true,"Message":"No comments for this vibe"})
    }
    res.status(200).json({success:true,"data":result})
}catch(e){
res.status(500).json({"success":false,"message":"internal issue"})
}
}

export const feed = async (req, res) => {
    try {
        const currentUser = req.user;
        if (!currentUser) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Get vibes from users the current user follows
        const vibes = await Vibe.find({
            author: { $in: currentUser.following }
        }).populate('author', 'name').sort({ _id: -1 });
        return res.status(200).json({ success: true, data: vibes });
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal error" });
    }
};

export const deleteVibe = async (req, res) => {
    try {
        const vibeId = req.params.id;
        const currentUser = req.user;
        const vibe = await Vibe.findById(vibeId);
        if (!vibe) {
            return res.status(404).json({ message: "Vibe not found" });
        }
        if (vibe.author.toString() !== currentUser._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own vibe." });
        }
        await Vibe.findByIdAndDelete(vibeId);
        return res.status(200).json({ message: "Vibe deleted successfully." });
    } catch (e) {
        res.status(500).json({ message: "Internal server error." });
    }
};