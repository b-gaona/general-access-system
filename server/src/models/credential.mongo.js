const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema({
  credential: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = {
  Credential: mongoose.model("Credential", credentialSchema),
  credentialSchema,
}; //The credentialSchema is assigned to the Credential model
