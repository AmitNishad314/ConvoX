import httpStatus from "http-status"
import {User} from "../models/user.model.js"
import bcrypt ,{hash} from "bcrypt"
import crypto from "crypto";

const register = async (req,res)=>{
    const {name,userName,password} = req.body;

    try{
         const existingUser = await User.findOne({userName})

         if(existingUser){
            return res.status(httpStatus.FOUND).json({message:"User already exist"})
         }
         
         const hashedPassword = await bcrypt.hash(password,10)

         const newUser = new User(
            {
                name:name,
                userName:userName,
                password:hashedPassword,
            }
         )

         await newUser.save()

         res.status(httpStatus.CREATED).json({message:"new user Registered"})
    }
    catch (e){
        res.json({message:`Somthing went wrong ${e}`})
    }

}

const login = async (req,res)=>{
    const {userName,password} = req.body;

    if(!userName || !password){
        return res.status(400).json({message:"Invalid User or Password"})
    }
    try{
        const user = await User.findOne({userName})
        if(!user)return res.status(httpStatus.NOT_FOUND).json({message:"username not found"})
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            let token = crypto.randomBytes(20).toString("hex")

            user.token = token
            await user.save()
            return res.status(httpStatus.OK).json({
                message: "Logged in successfully",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    userName: user.userName,
                },
            })
        }

    }catch(e){
        res.status(400).json({message:`some error occured ${e}`})
    }
}

export {login,register}