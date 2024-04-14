import express from "express";
import { auth, authResto } from "../middlewares/auth";
import {
  createRating,
  deleteRating,
  getMyRatings,
  getRating,
  getRestoRatings,
  replyRating,
  updateRating,
} from "../controllers/ratingController";

const ratingRouter = express.Router();

ratingRouter.post("/create/:restoId", auth, createRating);
ratingRouter.put("/update/:ratingId", auth, updateRating);
ratingRouter.get("/get/:ratingId", auth, getRating);
ratingRouter.delete("/delete/:ratingId", auth, deleteRating);
ratingRouter.get("/getRestoRatings/:restoId", getRestoRatings);
ratingRouter.get("/getMyRatings", authResto, getMyRatings);
ratingRouter.put("/replyRating/:ratingId", authResto, replyRating);

export default ratingRouter;
