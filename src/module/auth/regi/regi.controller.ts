import { Request, Response } from "express";
import { regiService } from "./regi.services";

 const createUser = async (req:Request,res:Response)=>{

   try{

    const result = await regiService.insertUser(req.body);

    delete result.rows[0].password;

    res.status(201).json({
        success : true,
        message : "User Registered successfully ",
        data : result.rows[0]

    })
   }catch(err:any){
    res.status(500).json({
        success : false,
        message : "Can't create an account",
        details : err.message
    })
   }
}

export const regiController = {
    createUser
};