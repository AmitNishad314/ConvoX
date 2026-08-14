import httpStatus from "http-status"
import {User} from "../models/user.model.js"
import bcrypt ,{hash} from "bcrypt"
import jwt from "jsonwebtoken";

const register = async (req,res)=>{
    const {name,userName,password} = req.body;

    try {
        console.log("Register request:", req.body);
    
        const existingUser = await User.findOne({ userName });
        console.log("Existing user:", existingUser);
    
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({
                message: "User already exist",
            });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new User({
            name,
            userName,
            password: hashedPassword,
        });
    
        console.log("Before save");
    
        await newUser.save();
    
        console.log("After save");
        console.log("Saved user:", newUser);
    
        return res.status(httpStatus.CREATED).json({
            message: "new user Registered",
        });
    
    } catch (e) {
        console.error(e);   // <-- IMPORTANT
        return res.status(500).json({
            message: e.message,
        });
    }

}

const login = async (req,res)=>{
    const {userName,password} = req.body;
    console.log(req.body);

    if(!userName || !password){
        return res.status(400).json({message:"Invalid User or Password"})
    }
    try{
        const user = await User.findOne({userName})
        if(!user)return res.status(httpStatus.NOT_FOUND).json({message:"username not found"})
            const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid password",
            });
        }
        
        const token = jwt.sign(
            {
                id: user._id,
                userName: user.userName,
            },
            "convox_secret_key",
            {
                expiresIn: "7d",
            }
        );
        
        return res.status(httpStatus.OK).json({
            message: "Logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                userName: user.userName,
            },
        });
        }

    catch(e){
        res.status(400).json({message:`some error occured ${e}`})
    }
}

export {login,register}