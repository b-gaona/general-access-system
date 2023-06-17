const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema({
  area: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = {
  Area: mongoose.model("Area", areaSchema),
  areaSchema,
}; //The areaSchema is assigned to the User model
