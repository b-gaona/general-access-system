const mongoose = require("mongoose");
const { userSchema } = require("./user.mongo");

const statusSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    required: true,
  },
  user: {
    type: userSchema,
    required: true,
    index: false,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = {
  Status: mongoose.model("Status", statusSchema),
  statusSchema,
};
