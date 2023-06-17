const express = require("express");

const { httpGetAllDepartments, httpAddDepartment } = require("./department.controller");

const departmentRouter = express.Router();

departmentRouter.get("/", httpGetAllDepartments);
departmentRouter.get("/add/:department", httpAddDepartment);

module.exports = departmentRouter;

//TODO: Add a new department with a POST request
