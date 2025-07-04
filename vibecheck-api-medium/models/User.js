import { password } from "bun";
import mongoose,{Schema} from "mongoose";


const UserSchema = new Schema(
    {
        name:{
                type:String,
                required:true,
                trim:true
            },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:true
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }]
    }
)
const User = mongoose.model("User",UserSchema)
export default User