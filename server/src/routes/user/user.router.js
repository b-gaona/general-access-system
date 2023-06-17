const express = require("express");

const {
  httpGetAllUsers,
  httpAddUser,
  httpGetUserByKeyword,
  httpGetUserPlate,
  httpDeleteUserById,
  httpUpdateUserById,
} = require("./user.controller");

const userRouter = express.Router();

userRouter.get("/", httpGetAllUsers);
userRouter.get("/get/:keyword", httpGetUserByKeyword);
userRouter.get("/get/plate/:plate", httpGetUserPlate);

userRouter.post("/add", httpAddUser);

userRouter.put("/update/:id", httpUpdateUserById);

userRouter.delete("/delete/:id", httpDeleteUserById);

module.exports = userRouter;
