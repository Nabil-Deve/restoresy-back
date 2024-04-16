import Resto from "../models/restoModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

require("dotenv").config();

const createResto = async (req, res) => {
  try {
    let newResto = await Resto.create(req.body);
    res.json({ message: "Resto created", newResto });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const resto = await Resto.findOne({ email: email });

    const validate = await bcrypt.compare(password, resto.password);
    if (resto && validate) {
      const token = jwt.sign(
        { email: resto.email, _id: resto._id },
        config.JWT_SECRET
      );
      resto.password = null; // Avant d'envoyer le resto au fronted, on enlève le champ mot de passe. On masque ce champ.
      res.json({ token, resto });
    } else {
      res.status(401).json({ error: " Vos identifiants sont invalides" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// TODO créer controller getResto
const getResto = async (req, res) => {
  try {
    const resto = await Resto.findById(req.resto._id); // On récupère l'id dans le token envoyé dans la requête qui a été décodée par le serveur.
    res.json(resto);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//updateResto
const updateResto = async (req, res) => {
  try {
    console.log("CALLLLLLLLLLLLLED");
    const resto = await Resto.updateOne({ _id: req.resto._id }, req.body);
    res.status(200).send("Resto has been updated");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//deleteResto
const deleteResto = async (req, res) => {
  try {
    const resto = await Resto.deleteOne({ _id: req.resto._id });
    res.status(200).send("Resto has been deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export { createResto, login, getResto, updateResto, deleteResto };
