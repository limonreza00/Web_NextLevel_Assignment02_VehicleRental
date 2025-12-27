import express from "express";
import { loginController } from "./login.controller";

const router = express.Router();
router.post("/api/v1/auth/signin", loginController.loginUsers);

export const loginRoutes = router;
