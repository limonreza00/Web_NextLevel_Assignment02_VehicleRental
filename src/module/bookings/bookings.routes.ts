import express from "express";
import { bookingsController } from "./bookings.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types/roles.type";

const router = express.Router();

router.post("/api/v1/bookings", bookingsController.createBooking);

router.get(
  "/api/v1/bookings",
  auth(Role.admin, Role.customer),
  bookingsController.getAllbookings
);

router.put(
  "/api/v1/bookings/:bookingId",
  auth(Role.admin, Role.customer),
  bookingsController.updateBooking
);

export const bookingsRoutes = router;
