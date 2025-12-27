import express from "express";
import { userController } from "./users.controller";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";
import { Role } from "../../types/roles.type";

const router = express.Router();

router.get("/api/v1/users", logger, auth("admin"), userController.getUsers);

router.put(
  "/api/v1/users/:userId",
  auth(Role.admin, Role.customer),
  userController.updateUser
);

router.delete(
  "/api/v1/users/:userId",
  auth(Role.admin),
  userController.deleteUser
);

export const userRoutes = router;
