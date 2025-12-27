import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variables");
}

if (!process.env.DB_CONNECTION_STRING) {
  throw new Error("DB_CONNECTION_STRING is not defined");
}

const config = {
  port: process.env.PORT,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  jwtSecretKey: process.env.JWT_SECRET as string,
};

export default config;
