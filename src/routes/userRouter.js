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
  uploadUserPhoto,
} from "../controllers/userController";
import { auth } from "../middlewares/auth";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/../images");
  },
  filename: function (req, file, cb) {
    // Define a custom filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Set the file name with its original extension
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const userRouter = express.Router();

userRouter.post("/register", createUser); // CREATE
userRouter.get("/get", auth, getUser); // RETRIEVE
userRouter.put("/update", auth, updateUser); // UPDATE
userRouter.delete("/delete", auth, deleteUser); // DELETE
userRouter.post("/login", login);
userRouter.get("/get/restos", getAllRestos);
userRouter.get("/get/resto/:restoId", getRestoById);
userRouter.post("/searchResto", searchRestos);
userRouter.post(
  "/uploadUserPhoto",
  upload.single("image"),
  auth,
  uploadUserPhoto
);

export default userRouter;
