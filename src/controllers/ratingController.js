import Rating from "../models/ratingModel";
import Resto from "../models/restoModel"; // les collections ou tables sont en majuscule

const createRating = async (req, res) => {
  try {
    const restoId = req.params.restoId; // ici on récupère l'id du resto envoyé depuis le front (qui se trouve dans les paramètres de la requête càd dans l'url)
    const resto = await Resto.findById(restoId); // on cherche le resto avec l'id récupéré en haut en appelant la fonction findById de mongoose (driver de mongodb qui fait le pont entre le serveur nodejs et mongodb)
    if (resto) {
      // on vérifie si le resto existe bel et bien. C'est important pour savoir si on peut ajouter un rating. Si le resto n'existe pas avec cet id, c'est pas logique d'ajouter un rating
      const rating = new Rating(req.body); // on créé un rating en instanciant la collection Rating
      rating.user = req.user._id; // on associe l'id de l'utilisateur connecté au champ user du rating qu'on vient de créer
      rating.resto = resto._id; // L'id du resto (auquel on veut déposer un avis) au champ resto du rating qu'on vient de créer
      rating.stars = req.body.stars;
      await rating.save(); // on sauvegarde le rating dans la base de données. Si on ne fait pas .save() le rating qu'on a créé disparaitra dans la nature. Il ne sera pas sauvegardé en dur dans la base de données.
      res.json(rating); // on envoie le rating créé au front.
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateRating = async (req, res) => {
  try {
    const rating = await Rating.updateOne(
      {
        _id: req.params.ratingId,
        user: req.user._id,
      },
      req.body
    );
    res.status(200).send("Rating has been updated successfully"); // Envoie une réponse avec le statut 200 pour indiquer que la réservation a été mise à jour avec succès
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.ratingId);
    res.json(rating);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.deleteOne({
      _id: req.params.ratingId,
      user: req.user._id,
    });
    res.status(200).json("Rating has been deleted");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Fonction qui permet de récupérer tous les avis sur un resto
const getRestoRatings = async (req, res) => {
  try {
    const restoId = req.params.restoId; // On récupère l'id du resto
    // on cherche tous les ratings d'un resto à partir de l'id de ce resto
    const ratings = await Rating.find({ resto: restoId }).populate("user");
    res.json(ratings);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Fonction qui permet de récupérer tous les avis par le resto
const getMyRatings = async (req, res) => {
  try {
    const restoId = req.resto._id;
    const ratings = await Rating.find({ resto: restoId })
      .populate("user")
      .sort({ createdAt: -1 }); // On trie les avis par ordre décroissant
    res.json(ratings);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

// controlleur pour répondre à un avis de l'utilisateur
const replyRating = async (req, res) => {
  try {
    const restoId = req.resto._id;
    const ratingId = req.params.ratingId;
    const { restoReply } = req.body;

    await Rating.updateOne({ _id: ratingId, resto: restoId }, { restoReply });
    const rating = await Rating.findOne({
      _id: ratingId,
      resto: restoId,
    }).populate("user");
    res.json(rating);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

export {
  createRating,
  updateRating,
  getRating,
  deleteRating,
  getRestoRatings,
  getMyRatings,
  replyRating,
};
