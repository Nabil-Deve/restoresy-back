import express from "express";
import {
  createUser,
  deleteUser,
  getAllRestos,
  getRestoById,
  getUser,
  login,
  searchRestos,
  updateUser,
} from "../controllers/userController";
import { auth } from "../middlewares/auth";

const userRouter = express.Router();

userRouter.post("/register", createUser); // CREATE
userRouter.get("/get", auth, getUser); // RETRIEVE
userRouter.put("/update", auth, updateUser); // UPDATE
userRouter.delete("/delete", auth, deleteUser); // DELETE
userRouter.post("/login", login);
userRouter.get("/get/restos", getAllRestos);
userRouter.get("/get/resto/:restoId", getRestoById);
userRouter.post("/searchResto", searchRestos);

export default userRouter;
