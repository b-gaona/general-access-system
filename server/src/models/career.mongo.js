const mongoose = require("mongoose");
const { areaSchema } = require("./area.mongo");

const careerSchema = new mongoose.Schema({
  career: {
    type: String,
    required: true,
  },
  areas: [areaSchema],
  date: {
    type: Date,
    required: true,
  },
});

module.exports = {
  Career: mongoose.model("Career", careerSchema),
  careerSchema,
}; //The careerSchema is assigned to the User model
