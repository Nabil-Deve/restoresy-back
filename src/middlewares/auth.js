import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/userModel";
import Resto from "../models/restoModel";
import Booking from "../models/bookingModel";

// Fonction qui permet de vérifier la validité du token de l'utilisateur qui est connecté à chaque fois que l'utilisateur
// fait une action côté front-end et envoie une requête. On doit inlure dans cette requête le token de ce dernier.
// Cela permet de vérifier si l'utilisateur est connecté ou non afin de l'autoriser à faire une réservation ou autre.
const auth = async (req, res, next) => {
  // on récupère le token dans le header de la requête
  const tokenHeader = req.headers.authorization;

  // Vérifier si le token existe
  if (!tokenHeader) {
    return res.status(401).send("Accès non autorisé");
  }
  const token = tokenHeader.split(" ")[1];

  // Vérifier la validité du token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Store decrypted user's datas to req
    // on cherche l'utilisateur qui a fait la requête dans la base de données
    const user = await User.findById(decoded._id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send("User does not exist");
    }
  } catch (error) {
    res.status(401).send("Token invalide");
  }
};

// Authentification du resto
const authResto = async (req, res, next) => {
  // on récupère le token dans le header de la requête
  const tokenHeader = req.headers.authorization;

  // Vérifier si le token existe
  if (!tokenHeader) {
    return res.status(401).send("Accès non autorisé");
  }
  const token = tokenHeader.split(" ")[1];

  // Vérifier la validité du token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Store decrypted user's datas to req
    // On cherche le restaurant qui a fait la requête dans la base de données.
    console.log("Decoded", decoded);
    const resto = await Resto.findById(decoded._id);
    if (resto) {
      req.resto = resto;
      next();
    } else {
      res.status(401).send("Resto does not exist");
    }
  } catch (error) {
    res.status(401).send("Token invalide");
  }
};

export { auth, authResto };
// auth : vérifier si le user est connecté. On l'utilise aussi dans les résas.
// authResto : vérifer si le resto est connecté.
