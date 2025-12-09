import express from "express";
import { regiController } from "./regi.controller";

const router = express.Router();

router.post("/api/v1/auth/signup",regiController.createUser);

export const regiRoutes = router;