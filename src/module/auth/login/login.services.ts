import { pool } from "../../../config/db"
import bycript from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from "../../../config";

const loginUser = async (email:string,password:string)=>{

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);
    
    if(result.rows.length === 0){
        return null;
    }

    const user = result.rows[0];

    const matchPass = await bycript.compare(password,user.password);

    if(!matchPass){
        return false;
    }

    const secretKey =config.jwtSecretKey;
    const token = jwt.sign({id:user.id,name:user.name,email:user.email,role:user.role},secretKey as string,
        {expiresIn : '20d'}
    );

    delete user.password;
    
    return {token,user};
}

export const loginServices = {
    loginUser
}