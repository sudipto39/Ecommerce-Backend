const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is already exists"],
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be 8 character long"],
    maxlength: [64, "Password must be within 20 characters"]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;