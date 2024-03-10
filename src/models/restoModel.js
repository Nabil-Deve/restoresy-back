import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const restoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    hours: {
      type: String,
    },
    menu: {
      type: String,
    },
    about: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    imageURI: String,
  },
  {
    timestamps: true,
  }
);

restoSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const Resto = model("Resto", restoSchema);

export default Resto;
