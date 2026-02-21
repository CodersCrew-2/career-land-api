import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
    }
  },
  { timestamps: true },
);

// Model
const User = mongoose.model("user", userSchema);

export { User };
