import { pool } from "../config/db";

const getUserById = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM users WHERE id = $1;
  `,
    [id]
  );
  return result.rows[0];
};

const activeBookingsCheckByUserId = async (userId: string) => {
  const result = await pool.query(
    `
    SELECT * FROM bookings WHERE customer_id=$1 AND status='active' ;
    `,
    [userId]
  );

  return result.rows[0];
};

const getVehicleInfoById = async (vehicleId: string) => {
  const result = await pool.query(
    `
        SELECT * FROM vehicles WHERE id=$1;
        `,
    [vehicleId]
  );

  return result.rows[0];
};

export const helperService = {
  getVehicleInfoById,
  activeBookingsCheckByUserId,
  getUserById,
};
