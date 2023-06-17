const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = {
  Role: mongoose.model("Role", roleSchema),
  roleSchema,
}; //The roleSchema is assigned to the User model
