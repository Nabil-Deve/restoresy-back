import express from "express";
import volleyball from "volleyball"; // middleware pour Express : afficher des logs des requêtes HTTP reçues par le serveur Express.
import "dotenv/config"; // application Node.js sert à charger les variables d'environnement à partir d'un fichier .env situé à la racine du projet.
import mongoose from "mongoose";
import cors from "cors"; // CORS est un mécanisme de sécurité utilisé par les navigateurs web pour contrôler les requêtes HTTP
import userRouter from "./routes/userRouter";
import restoRouter from "./routes/restoRouter";
import bookingRouter from "./routes/bookingRouter";
import ratingRouter from "./routes/ratingRouter";

const app = express(); // Création d'une instance de l'application Express.
const port = process.env.PORT; // Récupération du port à partir des variables d'environnement

app.use(volleyball); // Utilisation du middleware Volleyball pour afficher les logs des requêtes HTTP
//app.use(cors()); // Utilisation du middleware CORS pour gérer les requêtes HTTP entre différents domaines

const corsOptions = {
  origin: "https://restoresy-front-alpha.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Origin",
    "Accept",
  ],
  maxAge: 7200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // This replaces the custom OPTIONS handler

// main().catch((err) => console.log(err)); // Appel de la fonction principale pour établir la connexion à la base de données MongoDB

//async function main() {
//await mongoose.connect(
//"mongodb+srv://Nabil:Fletch@cluster0.930izzf.mongodb.net/"
//); // Connexion à la base de données MongoDB à partir de l'URL définie dans les variables d'environnement
//console.log("[📡 DATABASE] - Connected");
//}

// Fonction qui remplace la précédente qui permet de connecter directement
let cachedDbConnection = null;
async function connectToDatabase() {
  if (cachedDbConnection) {
    console.log("Using cached database instance.");
    return Promise.resolve(cachedDbConnection);
  }
  const db = await mongoose.connect(
    "mongodb+srv://Nabil:Fletch@cluster0.930izzf.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  cachedDbConnection = db;
  return db;
}

app.use(express.json()); // Utilisation du middleware pour parser (convertir pour que le backend puisse les lire) les données au format JSON
app.use(express.urlencoded({ extended: false })); // Utilisation du middleware pour parser les données d'un formulaire HTML

// On appelle la fonction connect à MongoDB et l'utiliser
// Middleware to ensure database connection
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/users", userRouter); // Utilisation du routeur pour les routes liées aux utilisateurs
app.use("/restos", restoRouter); // Utilisation du routeur pour les routes liées aux restaurants
app.use("/bookings", bookingRouter);
app.use("/ratings", ratingRouter);
app.use("/images", express.static("images"));

app.get("/", (req, res) => {
  res.send("restoresy back"); // Réponse du serveur à la requête GET sur la route principale
});

//app.listen(port, () => {
//console.log(`restoresy Back running: http://localhost:${port}`); // Démarrage du serveur Express sur le port spécifié
//dans les variables d'environnement

//});

export default app;
