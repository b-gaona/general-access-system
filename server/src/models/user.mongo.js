const { areaSchema } = require("./area.mongo");
const { careerSchema } = require("./career.mongo");
const { departmentSchema } = require("./department.mongo");
const { roleSchema } = require("./role.mongo");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: roleSchema,
    required: true,
  },
  plate: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  career: {
    type: careerSchema,
    required: function () {
      return this.role && this.role.role !== "Administrativo";
    },
  },
  area: {
    type: areaSchema,
    required: function () {
      return this.role && this.role.role === "Alumno";
    },
  },
  department: {
    type: departmentSchema,
    required: function () {
      return this.role && this.role.role === "Administrativo";
    },
  },
  date: {
    type: Date,
    required: true,
  },
  card_id: {
    type: String,
    required: false,
    unique: true,
  },
});

module.exports = {
  User: mongoose.model("User", userSchema),
  userSchema,
};
