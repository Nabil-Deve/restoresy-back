import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
  //Définition du schéma pour les réservations
  user: { type: Schema.Types.ObjectId, ref: "User" }, //collection
  resto: { type: Schema.Types.ObjectId, ref: "Resto" },
  comment: String,
  date: Date,
  hour: Date,
  numberGuests: Number,
  status: {
    type: String,
    default: "pending", // Une résa est en attente par défaut
    enum: ["pending", "accepted", "refused", "canceled"], // Le statut de la résa peut prendre 4 valeurs possible.
  },
});

const Booking = model("Booking", bookingSchema);
export default Booking;
