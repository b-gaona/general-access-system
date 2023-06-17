const express = require("express");

const { httpGetAllCareers, httpAddCareer, httpGetCareerById } = require("./career.controller");

const careerRouter = express.Router();

careerRouter.get("/", httpGetAllCareers);
careerRouter.get("/add", httpAddCareer);
careerRouter.get("/get/:id", httpGetCareerById);

module.exports = careerRouter;

//TODO: Add a new career with a POST request