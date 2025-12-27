import express from "express";
import { loginController } from "./login.controller";
import auth from "../../../middleware/auth";
import { Role } from "../../../types/roles.type";

const router = express.Router();
router.post("/api/v1/auth/signin", loginController.loginUsers);

export const loginRoutes = router;
