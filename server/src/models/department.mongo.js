const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = {
  Department: mongoose.model("Department", departmentSchema),
  departmentSchema,
}; //The departmentSchema is assigned to the User model
