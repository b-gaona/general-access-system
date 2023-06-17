const express = require("express");

const { httpGetAllRoles, httpAddRole } = require("./role.controller");

const roleRouter = express.Router();

roleRouter.get("/", httpGetAllRoles);
roleRouter.get("/add/:role", httpAddRole);

module.exports = roleRouter;

//TODO: Add a new role with a POST request