const { areaSchema } = require("./area.mongo");
const { careerSchema } = require("./career.mongo");
const { departmentSchema } = require("./department.mongo");
const { roleSchema } = require("./role.mongo");
const { credentialSchema } = require("./credential.mongo");
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
    type: credentialSchema,
    required: false,
  },
});

userSchema.index(
  { "card_id.credential": 1 },
  {
    unique: true,
    partialFilterExpression: { "card_id.credential": { $exists: true } },
  }
);

module.exports = {
  User: mongoose.model("User", userSchema),
  userSchema,
};
