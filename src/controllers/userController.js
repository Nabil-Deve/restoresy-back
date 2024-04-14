import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Resto from "../models/restoModel";

require("dotenv").config();

const createUser = async (req, res) => {
  // Définition de la fonction asynchrone createUser pour créer un nouvel utilisateur.
  try {
    let newUser = await User.create(req.body); // Création d'un nouvel utilisateur en utilisant le modèle User et les données fournies dans la requête.
    res.json({ message: "User created", newUser }); // Envoi d'une réponse JSON indiquant que l'utilisateur a été créé avec succès.
  } catch (error) {
    // Gestion des erreurs potentielles.
    res.status(500).json(error.message); // Envoi d'une réponse d'erreur avec le statut 500 et le message d'erreur.
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Extraction de l'email et du mot de passe de la requête.
    const user = await User.findOne({ email: email }); // Recherche de l'utilisateur dans la base de données en fonction de son email.

    const validate = await bcrypt.compare(password, user.password); // Vérification de la correspondance du mot de passe haché avec celui stocké en base de données.
    if (user && validate) {
      // Si l'utilisateur et le mot de passe sont valides :
      const token = jwt.sign(
        // génère token contenant le mail et l'Id du user qu'on peut utiliser pour l'authentifier dans les autres requêtes
        { email: user.email, _id: user._id },
        process.env.JWT_SECRET // Utilisation de la clé secrète JWT définie dans les variables d'environnement.
      );
      user.password = null; // Avant d'envoyer le user au fronted, on enlève le champ mot de passe. On masque ce champ (Le 23 février).
      res.json({ token, user }); // Envoi du token JWT dans la réponse JSON.
    } else {
      // Si l'authentification échoue :
      res.status(401).json({ error: " Vos identifiants sont invalides" }); // Envoi d'une réponse d'erreur avec le statut 401.
    }
  } catch (error) {
    // Gestion des erreurs potentielles.
    res.status(500).json(error.message); // Envoi d'une réponse d'erreur avec le statut 500 et le message d'erreur.
  }
};

const updateUser = async (req, res) => {
  // Définition de la fonction asynchrone updateUser pour mettre à jour les informations d'un utilisateur.
  try {
    const user = await User.updateOne({ _id: req.user._id }, req.body); // mettre à jour les infos du user avec son id
    res.status(200).send("User has been updated");
  } catch (error) {
    // Gestion des erreurs potentielles.
    res.status(500).json(error.message); // Envoi d'une réponse d'erreur avec le statut 500 et le message d'erreur.
  }
};

const getUser = async (req, res) => {
  // Définition de la fonction asynchrone getUser pour récupérer les informations d'un utilisateur.
  try {
    const user = await User.findById(req.user._id); // Recherche de l'utilisateur dans la base de données en fonction de son ID.
    res.json(user); // Envoi des informations de l'utilisateur dans la réponse JSON.
  } catch (error) {
    // Gestion des erreurs potentielles.
    res.status(500).json(error.message); // Envoi d'une réponse d'erreur avec le statut 500 et le message d'erreur.
  }
};

const deleteUser = async (req, res) => {
  // Définition de la fonction asynchrone deleteUser pour supprimer un utilisateur.
  try {
    const user = await User.deleteOne({ _id: req.user._id }); // Suppression de l'utilisateur en fonction de son ID.
    res.status(200).send("User has been deleted");
  } catch (error) {
    // Gestion des erreurs potentielles.
    res.status(500).json(error.message); // Envoi d'une réponse d'erreur avec le statut 500 et le message d'erreur.
  }
};

// Création du controller getAllresto qui permet de récupérer tous les restos depuis la bases de données.
const getAllRestos = async (req, res) => {
  try {
    const restos = await Resto.find().select("-password"); // Il cherche tous les restos présents dans la bdd en enlevant les mots de passe qui ne doivent pas être envoyés au frontend.
    res.json(restos);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getRestoById = async (req, res) => {
  try {
    const resto = await Resto.findById(req.params.restoId).select("-password");
    if (resto) {
      res.json(resto);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const searchRestos = async (req, res) => {
  try {
    const query = req.body.query;
    const regex = new RegExp(query, "i");
    let filters = {
      $or: [{ name: regex }, { address: regex }, { cuisine: regex }],
    };

    // on recherche les restos avec les filtres précédents
    const restos = await Resto.find(filters).select("-password");
    res.json(restos);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const uploadUserPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.photoURI = req.file.filename;
    await user.save();

    res.json({ photoURI: user.photoURI });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

export {
  createUser,
  login,
  updateUser,
  getUser,
  deleteUser,
  getAllRestos,
  getRestoById,
  searchRestos,
  uploadUserPhoto,
}; // Exportation des fonctions createUser, login, updateUser, getUser et deleteUser pour les rendre accessibles depuis d'autres fichiers.
