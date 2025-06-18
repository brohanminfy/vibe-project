import jwt from 'jsonwebtoken'
import User from '../models/User'

const auth = async (req,res,next)=>{
    try{
    const jwtToken = await req.headers.authorization
    if(!jwtToken){
        return res.status(400).json({message:"Authentication required!!"})
    }
    const decode = jwt.verify(jwtToken,process.env.JWT_SECRET)
    req.user = decode
    next();
    }catch(e){
        return res.status(401).json({message:"Invalid token"+e})
        console.log(e)
    }
}
export default auth