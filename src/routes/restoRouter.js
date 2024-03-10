import express from "express";
import {
  createResto,
  deleteResto,
  getResto,
  login,
  updateResto,
} from "../controllers/restoController";
import { authResto } from "../middlewares/auth";
const restoRouter = express.Router();

// créer la route /get, /update, /delete
// ne pas oublier de rajouter le middleware auth dans les 3 routes que tu vas créer
// tester TOUTES les routes de register à delete dans postman
// les étapes pour postman : créer un nouveau resto,
// faire son login et copier le token, update le resto en ajoutant le token dans Auth de postman en sélectionnant Bearer Token et en collant le token
// ...suite => faire pareil pour le get, et le delete
// à chaque requête de postman, aller dans MongoDB atlas et checker que chaque modif est effective

restoRouter.post("/register", createResto);
restoRouter.post("/login", login);
restoRouter.get("/get", authResto, getResto);
restoRouter.put("/update", authResto, updateResto);
restoRouter.delete("/delete", authResto, deleteResto);

export default restoRouter;
