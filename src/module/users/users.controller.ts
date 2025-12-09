import { Request, Response } from "express";
import { userService } from "./users.services";
import { Role } from "../../types/roles.type";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      details: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.userId as string;
  const { name, email, phone, role } = req.body;
  try {
    const authUser = req.user as any;
    const userRole = authUser.role;
    const getUserId = authUser.id;

    if (!authUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (userRole === Role.admin) {
      const result = await userService.updateUser(id, name, email, phone, role);
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    } else if (userRole === Role.customer) {
      if (getUserId != id) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only update your own profile",
        });
      }
      const result = await userService.updateUser(
        id,
        name,
        email,
        phone,
        userRole
      );
      res.status(200).json({
        success: true,
        message: "Your Profile updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      details: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.userId as string;
  try {
    const result = await userService.deleteUser(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      details: err.message,
    });
  }
};

export const userController = {
  getUsers,
  updateUser,
  deleteUser,
};
