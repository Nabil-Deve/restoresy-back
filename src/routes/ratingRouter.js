import express from "express";
import { auth } from "../middlewares/auth";
import {
  createRating,
  deleteRating,
  getRating,
  updateRating,
} from "../controllers/ratingController";

const ratingRouter = express.Router();

ratingRouter.post("/create/:restoId", auth, createRating);
ratingRouter.put("/update/:ratingId", auth, updateRating);
ratingRouter.get("/get/:ratingId", auth, getRating);
ratingRouter.delete("/delete/:ratingId", auth, deleteRating);
export default ratingRouter;
