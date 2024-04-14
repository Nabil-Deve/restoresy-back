import { Schema, model } from "mongoose";

const ratingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    resto: { type: Schema.Types.ObjectId, ref: "Resto" },
    content: String,
    stars: Number,
    restoReply: String,
  },
  { timestamps: true } // Cela va permettre de dater les avis postés
);

const Rating = model("Rating", ratingSchema);
export default Rating;
