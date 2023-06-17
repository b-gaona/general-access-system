const express = require("express");

const {
  httpGetAllStatus,
  httpAddStatus,
} = require("./status.controller");

const statusRouter = express.Router();

statusRouter.get("/", httpGetAllStatus);
statusRouter.get("/add", httpAddStatus);

module.exports = statusRouter;
