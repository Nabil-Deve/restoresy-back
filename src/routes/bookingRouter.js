import express from "express";
import {
  acceptBooking,
  cancelBooking,
  createBooking,
  deleteBooking,
  getBooking,
  getRestoBookings,
  getUserBookings,
  refuseBooking,
  updateBooking,
} from "../controllers/bookingController";
import { auth, authResto } from "../middlewares/auth";
const bookingRouter = express.Router();

bookingRouter.post("/create/:restoId", auth, createBooking);
bookingRouter.put("/update/:bookingId", authResto, updateBooking); // authResto car c'est le resto qui met à jour
bookingRouter.get("/get/:bookingId", authResto, getBooking);
bookingRouter.delete("/delete/:bookingId", authResto, deleteBooking);
bookingRouter.get("/getUserBookings", auth, getUserBookings);
bookingRouter.put("/cancel/:bookingId", auth, cancelBooking);
bookingRouter.get("/getRestoBookings", authResto, getRestoBookings);
bookingRouter.put("/refuseBooking/:bookingId", authResto, refuseBooking);
bookingRouter.put("/acceptBooking/:bookingId", authResto, acceptBooking);

export default bookingRouter;
