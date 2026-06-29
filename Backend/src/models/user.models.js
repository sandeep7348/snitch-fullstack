import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    contact: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Contact must be a 10-digit phone number"],
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    console.log(`Hashing password for user: ${this.email}`);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    // rethrow to let mongoose handle the error
    throw err;
  }
});

const User = mongoose.model("User", userSchema);

export default User;
