const express = require("express");

const { httpGetEventChanges, httpGetCredentialChanges } = require("./events.controller");

const eventRouter = express.Router();

eventRouter.get("/", httpGetEventChanges);
eventRouter.get("/credential", httpGetCredentialChanges);

module.exports = eventRouter;
