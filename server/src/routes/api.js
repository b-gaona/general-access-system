const express = require("express");

const userRouter = require("./user/user.router");
const careerRouter = require("./career/career.router");
const areaRouter = require("./area/area.router");
const roleRouter = require("./role/role.router");
const departmentRouter = require("./department/department.router");
const eventRouter = require("./events/events.router");
const statusRouter = require("./status/status.router");

const api = express.Router();

const endpoints = {
  users: {
    add: "POST /users/add",
    getAll: "GET /users",
    getByKeyword: "GET /users/get/Keyword",
  },
  carrers: {
    add: "GET /careers/add?career=CareerName&areas=AreasSeparatedByCommaAndSpace",
    getById: "GET /careers/get/CareerId",
    getAll: "GET /careers",
  },
  areas: {
    add: "GET /areas/add/AreaName",
    getAll: "GET /areas",
  },
  roles: {
    add: "GET /roles/add/RoleName",
    getAll: "GET /roles",
  },
  departments: {
    add: "GET /departments/add/DepartmentName",
    getAll: "GET /departments",
  },
  status: {
    add: "GET /status/add?plate=plate",
    getAll: "GET /status",
  },
  events: "GET /events",
};

api.use("/users", userRouter);
api.use("/careers", careerRouter);
api.use("/areas", areaRouter);
api.use("/roles", roleRouter);
api.use("/departments", departmentRouter);
api.use("/events", eventRouter);
api.use("/status", statusRouter);
api.use("/", (req, res) => {
  return res.status(200).json(endpoints);
});

module.exports = api;
