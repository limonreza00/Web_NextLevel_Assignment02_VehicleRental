import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path:path.join(process.cwd(),'.env') });

const config = {
    port : process.env.PORT,
    dbConnectionString : process.env.DB_CONNECTION_STRING,
    jwtSecretKey : process.env.JWT_SECRET
};

export default config;