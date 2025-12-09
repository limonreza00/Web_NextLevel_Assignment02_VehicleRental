import { pool } from "../../config/db";
import { helperService } from "../../helper/user.helper.service";

const getAllUsers = async () => {
  const result = await pool.query(`
        SELECT * FROM users;
    `);

  for (let i = 0; i < result.rows.length; i++) {
    delete result.rows[i].password;
  }
  return result;
};

const updateUser = async (
  id: string,
  name: string,
  email: string,
  phone: string,
  role: string
) => {
  const result = await pool.query(
    `
    UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *;
    `,
    [name, email, phone, role, id]
  );

  const user = result.rows[0];
  delete user.password;
  return result;
};

const deleteUser = async (id: string) => {
  try {
    const activeBookingInfo = await helperService.activeBookingsCheckByUserId(
      id
    );

    if (activeBookingInfo) {
      throw new Error("You have active booking");
    }
  } catch (err: any) {
    throw err;
  }

  const result = await pool.query(
    `
    DELETE FROM users WHERE id=$1 RETURNING *;
    `,
    [id]
  );
  return result;
};

export const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
};
