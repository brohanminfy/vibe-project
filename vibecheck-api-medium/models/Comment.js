import mongoose,{Schema} from "mongoose";

const commentSchema = new Schema({
    comment:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    vibe:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Vibe',
        required:true
    }
})

const comments = mongoose.model("comments",commentSchema)
export default comments