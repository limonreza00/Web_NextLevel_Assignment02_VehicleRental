import { pool } from "../../../config/db";
import bycript from 'bcryptjs';
import { UserPayload } from "../../../types/user";

const insertUser= async(payload : UserPayload)=>{
    const {name,email,password,phone,role} = payload;

    if(password.length < 6){
        throw new Error ("Password must be at least 6 character")
    }

    const fixedEmail = email.toLowerCase();
    const hashedPassword = await bycript.hash(password,10)
    const result = await pool.query(`
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,[name,fixedEmail,hashedPassword,phone,role]
);

    return result;
}

export const regiService = {
    insertUser
};