import Resto from "../models/restoModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import { v2 as cloudinary } from "cloudinary";

require("dotenv").config();

cloudinary.config({
  cloud_name: "dtbpbn8w4",
  api_key: "742712573541959",
  api_secret: "NAhUxYWeIpbfXCTNztIUFhueCzg",
});

// const createResto = async (req, res) => {
//   try {
//     let newResto = await Resto.create(req.body);
//     res.json({ message: "Resto created", newResto });
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };
const createResto = async (req, res) => {
  try {
    const { email, image, ...restoData } = req.body;

    // Vérifier si un restaurant avec le même email existe déjà
    const existingResto = await Resto.findOne({ email: email });
    if (existingResto) {
      return res.status(409).json({ message: "Utilisateur déjà inscrit" });
    }

    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "resto_images",
      });
      restoData.imageURI = result.url;
    }

    const newResto = await Resto.create({ email, ...restoData });
    res.json({ message: "Resto created", newResto });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
