const express = require("express");

const { httpGetEventChanges } = require("./events.controller");

const eventRouter = express.Router();

eventRouter.get("/", httpGetEventChanges);

module.exports = eventRouter;
