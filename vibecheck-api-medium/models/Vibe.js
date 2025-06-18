import mongoose, {Schema} from 'mongoose'

const VibeSchema = new Schema({
    vibeMessage:{
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Vibe = mongoose.model("Vibe",VibeSchema)
export default Vibe