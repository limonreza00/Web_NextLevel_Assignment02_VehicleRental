import { pool } from "../../config/db";
import { VehiclePayload } from "../../types/vehicles.type";

const insertVehicles = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string
) => {
  const result = await pool.query(
    `
    INSERT INTO vehicles (vehicle_name,type,registration_number,daily_rent_price,availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`
        SELECT * FROM vehicles 
        `);
  return result;
};

const getVehicleById = async (vehicleId: string) => {
  const result = await pool.query(
    `
        SELECT * FROM vehicles WHERE id=$1
        `,
    [vehicleId]
  );
  return result;
};

const updateVehicleById = async (
  payload: Record<string, unknown>,
  vehicleId: string
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `
    UPDATE vehicles
    SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5
    WHERE id=$6
    RETURNING *;
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );
  return result;
};

const deleteVehicleById = async (vehicleId: string) => {
  const vehicleCheck = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);

  if (!vehicleCheck.rows[0]) {
    throw new Error("Vehicle not found");
  }

  const availabilityCheck = await pool.query(
    `
        SELECT availability_status FROM vehicles WHERE id=$1
        `,
    [vehicleId]
  );

  if (availabilityCheck.rows[0].availability_status === "booked") {
    throw new Error("Cannot delete this vehicle because it booked");
  }
  const result = await pool.query(
    `
    DELETE FROM vehicles WHERE id=$1 RETURNING *;
    `,
    [vehicleId]
  );
  return result.rows[0];
};

export const vehicleService = {
  insertVehicles,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
