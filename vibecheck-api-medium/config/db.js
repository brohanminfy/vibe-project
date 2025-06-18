import mongoose from "mongoose";

const uri = process.env.MONGODB_URI

const dbConnect = async ()=>{
    try{
        const connection = mongoose.connect(uri,
            console.log("DB connected")
        )
    }catch(e){
        console.log(`error is ${e}`)
    }
};

export default dbConnect