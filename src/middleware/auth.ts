import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const auth = (...roles : string[])=>{


    return async (req:Request,res:Response,next:NextFunction)=>{

        try{

        const authHeader = req.headers.authorization;
    
        if(!authHeader){
            return res.status(401).json({
                success : false,
                message : "Unauthorized"
            })
        }

        const decoded = jwt.verify(authHeader,config.jwtSecretKey as string)
        
        req.user = decoded as jwt.JwtPayload;


        if (roles.length && !roles.includes(req.user.role)){
            return res.status(403).json({
                success : false,
                message : "Forbidden access"
            })
        }

        return next();

        }catch (err:any){
            res.status(401).json({
                success : false,
                message : "Unauthorized access",
                details : err.message
            })
        }
    }
}
export default auth;