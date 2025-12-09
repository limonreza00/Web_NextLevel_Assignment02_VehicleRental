import { Request, Response } from "express";
import { loginServices } from "./login.services";

const loginUsers = async (req:Request,res:Response)=>{
    const {email,password} = req.body;
    try{
        const result = await loginServices.loginUser(email,password);

        res.status(200).json({
        success : true,
        message : "Login successfully ",
        data : result

    })
        
    } catch(err:any){
        res.status(500).json({
        success : false,
        message : "Can't create an account",
        details : err.message
    })
    }
   
}

export const loginController ={
    loginUsers
}