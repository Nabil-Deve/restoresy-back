import Booking from "../models/bookingModel";
import Resto from "../models/restoModel";
require("dotenv").config();

// Définition de la fonction asynchrone createBooking pour créer une nouvelle réservation
const createBooking = async (req, res) => {
  try {
    console.log(req.body);
    const restoId = req.params.restoId; // Récupère l'identifiant du restaurant à partir des paramètres de la requête
    // Recherche le restaurant correspondant dans la base de données avec son ID
    const resto = await Resto.findById(restoId);
    if (resto) {
      // Si le restaurant est trouvé
      const booking = new Booking(); // Crée une nouvelle instance de réservation avec les données fournies dans le corps de la requête
      booking.user = req.user._id;
      booking.resto = resto._id;
      booking.hour = req.body.hour;
      booking.numberGuests = req.body.numberGuests;
      booking.date = new Date(req.body.date);
      booking.comment = req.body.comment;
      await booking.save();

      console.log(booking.hour);
      res.json(booking);
    } else res.status(401).send("You can not book");
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

const updateBooking = async (req, res) => {
  try {
    // Met à jour la réservation avec les données fournies dans le corps de la requête
    const booking = await Booking.updateOne(
      { _id: req.params.bookingId, resto: req.resto._id }, // Recherche la réservation à mettre à jour par son identifiant et l'identifiant du restaurant associé
      req.body // Données de mise à jour
    );
    res.status(200).send("Booking has been updated successfully"); // Envoie une réponse avec le statut 200 pour indiquer que la réservation a été mise à jour avec succès
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate(
      "user resto",
      "-password"
    ); // important : populate permet de faire un joint.
    res.json(booking);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.deleteOne({ _id: req.params.bookingId }); // On récupère l'id dans les paramètres de la requête.
    res.status(200).json("Booking has been deleted");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    // on cherche tous les bookings d'un utilisateur avec son id
    const bookings = await Booking.find({ user: userId }).populate("resto");
    res.json(bookings);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const cancelBooking = async (req, res) => {
  try {
    const userId = req.user._id; // On récupère l'id du user
    const bookingId = req.params.bookingId; // On récupère le bookingId dans les params
    await Booking.updateOne(
      // On cherche la résa avec l'id du user et l'id du booking.
      { user: userId, _id: bookingId },
      { status: "canceled" } // On met à jour.
    );
    res.status(201).send("Booking has been canceled");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Fonction qui permet de récupérer les résas d'un resto
const getRestoBookings = async (req, res) => {
  try {
    const restoId = req.resto._id; // On récupère l'id du resto
    // on cherche tous les bookings d'un resto à partir de l'id de ce resto
    const bookings = await Booking.find({ resto: restoId }).populate("user");
    res.json(bookings);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Fonction qui permet de refuser la résa d'un client par le resto
const refuseBooking = async (req, res) => {
  try {
    const restoId = req.resto._id; // On récupère l'id du resto
    const bookingId = req.params.bookingId; // On récupère le bookingId dans les params :localhost3000
    await Booking.updateOne(
      // On cherche la résa avec l'id du resto et l'id du booking.
      { resto: restoId, _id: bookingId },
      { status: "refused" }
    );
    res.status(201).send("Booking has been refused");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Fonction qui permet d'accepter la résa d'un client par le resto
const acceptBooking = async (req, res) => {
  try {
    const restoId = req.resto._id; // On récupère l'id du resto
    const bookingId = req.params.bookingId; // On récupère le bookingId dans les params
    await Booking.updateOne(
      // On cherche la résa avec l'id du resto et l'id du booking.
      { resto: restoId, _id: bookingId },
      { status: "accepted" }
    );
    res.status(201).send("Booking has been accepted");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export {
  createBooking,
  updateBooking,
  getBooking,
  deleteBooking,
  getUserBookings,
  cancelBooking,
  getRestoBookings,
  refuseBooking,
  acceptBooking,
};
