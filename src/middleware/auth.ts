import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const parts = authHeader.split(" ");

      if (
        parts.length !== 2 ||
        parts[0]?.toLowerCase() !== "bearer" ||
        !parts[1]
      ) {
        return res
          .status(401)
          .json({ message: "Invalid authorization format" });
      }

      const token = parts[1];

      const jwtSecret = config.jwtSecretKey;
      if (!jwtSecret) {
        throw new Error("JWT secret key is missing");
      }

      const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }

      return next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access",
        details: err.message,
      });
    }
  };
};
export default auth;
