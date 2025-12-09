import express, { Request, Response } from "express";
import initDB from "./config/db";
import { regiRoutes } from "./module/auth/regi/regi.routes";
import { vehicleRoutes } from "./module/vehicles/vehicles.routes";
import { userRoutes } from "./module/users/users.routes";
import { bookingsRoutes } from "./module/bookings/bookings.routes";
import { loginRoutes } from "./module/auth/login/login.route";
import logger from "./middleware/logger";

const app = express();

app.use(express.json());

app.use(logger);

initDB();

app.get("/", (req, res) => {
  res.send(
    "Hello ! This is a vehicle rental service API from Programming Hero - Assignment 02"
  );
});

app.use("/", regiRoutes);

app.use("/", loginRoutes);

app.use("/", vehicleRoutes);

app.use("/api/v1", userRoutes);

app.use("/", bookingsRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).send("404 Not Found");
});

export default app;
