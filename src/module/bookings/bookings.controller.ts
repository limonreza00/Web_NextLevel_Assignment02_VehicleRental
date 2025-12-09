import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";
import { helperService } from "../../helper/user.helper.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.insertBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully ",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Can't booking right now",
      details: err.message,
    });
  }
};

const getAllbookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getAllbookings();
    const bookings = result.rows;

    const user = req.user as any;
    const role = user.role;
    const customerId = user.id;

    const enrichBooking = async (booking: any) => {
      const customerData = await helperService.getUserById(booking.customer_id);

      const vehicleData = await helperService.getVehicleInfoById(
        booking.vehicle_id
      );

      return {
        ...booking,
        customer: {
          name: customerData?.name,
          email: customerData?.email,
        },
        vehicle: {
          name: vehicleData?.vehicle_name,
          registration_number: vehicleData?.registration_number,
        },
      };
    };

    if (role === "admin") {
      const enrichedBookings = await Promise.all(bookings.map(enrichBooking));

      res.status(200).json({
        success: true,
        message: "Booking retrieved successfully ",
        data: enrichedBookings,
      });
    } else if (role === "customer") {
      const userBookings = result.rows.filter(
        (bookings) => bookings.customer_id === customerId
      );

      if (userBookings.length === 0) {
        throw new Error("You have no bookings");
      }

      const enrichedUserBookings = await Promise.all(
        userBookings.map(async (booking) => {
          const vehicleData = await helperService.getVehicleInfoById(
            booking.vehicle_id
          );

          return {
            ...booking,
            vehicle: {
              vehicle_name: vehicleData?.vehicle_name || "Unknown Vehicle",
              registration_number: vehicleData?.registration_number,
              type: vehicleData?.type,
            },
          };
        })
      );

      res.status(200).json({
        success: true,
        message: "Your Booking retrieved successfully ",
        data: enrichedUserBookings,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Can't booking right now",
      details: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;

    const user = req.user as any;
    const role = user.role;
    const userId = user.id;

    const booking = await bookingServices.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (role === "customer") {
      if (booking.customer_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to update this booking",
        });
      }

      if (status !== "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Customers can only cancel their bookings",
        });
      }

      const updatedBooking = await bookingServices.updateBookingStatus(
        bookingId,
        "cancelled"
      );

      // 2. Update vehicle availability
      const vehicleInfo = await bookingServices.updateVehicleAvailability(
        booking.vehicle_id,
        "available"
      );

      const updated = {
        ...updatedBooking,
        vehicle: vehicleInfo,
      };

      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: updated,
      });
    }
    if (role === "admin") {
      if (status !== "returned") {
        return res.status(400).json({
          success: false,
          message: "Admins can only mark bookings as returned",
        });
      }

      const updatedBooking = await bookingServices.updateBookingStatus(
        bookingId,
        "returned"
      );

      const vehicleInfo = await bookingServices.updateVehicleAvailability(
        booking.vehicle_id,
        "available"
      );

      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: {
          ...updatedBooking,
          vehicle: vehicleInfo,
        },
      });
    }

    return res.status(403).json({
      success: false,
      message: "Unauthorized role",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      details: error.message,
    });
  }
};

export const bookingsController = {
  createBooking,
  getAllbookings,
  updateBooking,
};
