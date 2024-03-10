import { Schema, model } from "mongoose";

const ratingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  resto: { type: Schema.Types.ObjectId, ref: "Resto" },
  content: String,
  stars: Number,
});

const Rating = model("Rating", ratingSchema);
export default Rating;
