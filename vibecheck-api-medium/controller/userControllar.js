import z from 'zod'
import User from '../models/User'
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const nameValidation = z.object({
    "name":z.string().min(3,{message:"Minimum 3 characters"})
}) 
const emailValidation = z.object({
        "email":z.string().email({message:"Invalid Email"}),
})
const passwordValidation = z.object({
    "password":z.string().min(6,{message:"Minimum 6 characters"})
    .regex(/[A-Z]/,{message:"Password should have atlease 1 upperCase"})
    .regex(/[a-z]/,{message:"Password should have atlease 1 lowerCase"})
    .regex(/[0-9]/,{message:"Password should have atleast 1 number"})
    .regex(/[\W_]/,{message:"Password should have atleast 1 special character"})
})

const validateUser = (name,email,password,res)=>{
    const userCheck = nameValidation.safeParse({name})
    const emailCheck = emailValidation.safeParse({email})
    const passwordCheck = passwordValidation.safeParse({password})
    if(!userCheck.success){
        res.status(400).json({message:"minimum 3 characters user name"})
    }
    if(!emailCheck.success){
        res.status(400).json({message:emailCheck.error})
    }
    if(!passwordCheck.success){
        res.status(400).json({message:passwordCheck.error})
    }
    return {success:true}
}

const encryptPassword = async(password)=>{
    const hash_pass = await bcrypt.hash(password,10)
    return hash_pass
}

const checkExistingUser = async(email)=>{
    try{
        const user = await User.findOne({email:email})
        return user
    }catch(e){
        console.log(`user exists ${e}`)
    }
}

const GenerateToken = async (user)=>{
    return jwt.sign(
        {
            userId : user.email,
            userPassword :user.password
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

export const signUp = async (req,res)=>{
try{
    
    const result= req.body
    const {name,email,password}= result
    validateUser(name,email,password,res)
    const existingUser = await checkExistingUser(email)
    if(existingUser){
        res.status(400).json({message:"User already exists"})
    }
    const hashPassword  = await encryptPassword(password)

    const user = await User.create({
        name,email,password:hashPassword
    })
    const tempToken = await GenerateToken(user)

    res.status(200).json({
        success:true,
        token:tempToken
    })
}catch(e){
    console.log(e)
    res.status(500).json({
        message:e.error
    })
}

}

export const login = async (req,res)=>{
    try{
        const result = req.body
        const {email,password} = result
        validateUser("DefaultName",email,password,res)
        if(!validateUser){
            res.status(400).json({success:false,message:"Validation error"})
        }

        const existingUser = await  checkExistingUser(email)

        if(!existingUser){
            return res.status(400).json({success:false,message:"DataBase error"})
        }

        const isPasswordValid = await bcrypt.compare(password,existingUser.password)
    
        if(!isPasswordValid){
          return  res.status(400).json({success:false,message:"Password invalid"})
        }
        const tempToken = await GenerateToken(existingUser)
        return res.status(200).json({
            success:true,
            token:tempToken
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({
            message:"Internal issue"
        })
    }
}