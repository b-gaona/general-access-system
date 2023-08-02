const express = require("express");

const {
  httpGetAllCredentials,
  httpAddCredential,
  httpGetCredentialById,
} = require("./credential.controller");

const credentialRouter = express.Router();

credentialRouter.get("/", httpGetAllCredentials);
credentialRouter.get("/add/:credential", httpAddCredential);
credentialRouter.get("/get/:id", httpGetCredentialById);

module.exports = credentialRouter;
