const express = require("express");

const {
  httpGetAllStatus,
  httpAddStatus,
  httpGetStatusByKeyword,
  httpGetStatusToExport,
  httpGetStatusByDate,
} = require("./status.controller");

const statusRouter = express.Router();

statusRouter.get("/", httpGetAllStatus);
statusRouter.get("/add", httpAddStatus);
statusRouter.get("/get/:keyword", httpGetStatusByKeyword);
statusRouter.get("/export", httpGetStatusToExport);
statusRouter.post("/get/dates", httpGetStatusByDate);

module.exports = statusRouter;
