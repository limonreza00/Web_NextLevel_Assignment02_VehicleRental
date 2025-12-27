import { Request, Response } from "express";
import { vehicleService } from "./vehicles.services";

const createVehicles = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vehicleService.insertVehicles(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    result.rows[0].daily_rent_price = Number(result.rows[0].daily_rent_price);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Can't add vehicle",
      details: err.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicle found",
        data: result.rows,
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Can't retrieved vehicle",
      details: err.message,
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId as string;

  try {
    const result = await vehicleService.getVehicleById(vehicleId);

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicle found",
        data: result.rows,
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Can't retrieved vehicle",
      details: err.message,
    });
  }
};

const updateVehicleById = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId as string;

  try {
    const result = await vehicleService.updateVehicleById(req.body, vehicleId);

    res.status(200).json({
      success: true,
      message: "Vehicles updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Can't update vehicle",
      details: err.message,
    });
  }
};

const deleteVehicleById = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId as string;
  try {
    const result = await vehicleService.deleteVehicleById(vehicleId);

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Can't delete vehicle",
      details: err.message,
    });
  }
};

export const vehicleController = {
  createVehicles,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
