import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    pasword: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", UserSchema);
export default User;

