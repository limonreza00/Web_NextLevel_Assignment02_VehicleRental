import { pool } from "../../config/db";

const insertBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  const timeDiff = endDate.getTime() - startDate.getTime();
  const daydiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  //======================================================================
  if (daydiff <= 0) {
    throw new Error("Invalid rental period");
  }

  const getVehicleInfo = await pool.query(
    `
        SELECT * FROM vehicles WHERE id=$1;
    `,
    [vehicle_id]
  );

  //======================================================================
  if (getVehicleInfo.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const dailyRentPrice = Number(getVehicleInfo.rows[0].daily_rent_price);
  const availabilityStatus = getVehicleInfo.rows[0].availability_status;
  const vehicle_name = getVehicleInfo.rows[0].vehicle_name;

  const total_price = dailyRentPrice * daydiff;

  if (availabilityStatus !== "available") {
    throw new Error("Vehicle is not available right now");
  }

  const result = await pool.query(
    `
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  const booking = result.rows[0];
  booking.vehicle = {
    vehicle_name,
    daily_rent_price: dailyRentPrice,
  };

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return booking;
};

const getAllbookings = async () => {
  const result = await pool.query(`
        SELECT * FROM bookings;
        `);
  return result;
};

const getBookingById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);
  return result.rows[0];
};

const updateBookingStatus = async (id: number, status: string) => {
  const result = await pool.query(
    `UPDATE bookings SET status = $2 WHERE id = $1 RETURNING *;`,
    [id, status]
  );
  return result.rows[0];
};

const updateVehicleAvailability = async (
  vehicleId: number,
  availability: string
) => {
  const result = await pool.query(
    `
      UPDATE vehicles
      SET availability_status = $2
      WHERE id = $1
      RETURNING id, availability_status;
    `,
    [vehicleId, availability]
  );
  return result.rows[0];
};

const deleteBookingById = async (id: number) => {
  const result = await pool.query(`DELETE FROM bookings WHERE id = $1`, [id]);
  return result;
};

export const bookingServices = {
  insertBooking,
  getAllbookings,
  getBookingById,
  updateBookingStatus,
  updateVehicleAvailability,
  deleteBookingById,
};
