const express = require("express");

const { httpGetAllAreas, httpAddArea } = require("./area.controller");

const areaRouter = express.Router();

areaRouter.get("/", httpGetAllAreas);
areaRouter.get("/add/:area", httpAddArea);

module.exports = areaRouter;

//TODO: Add a new area with a POST request