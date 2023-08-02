const {
  getAllUsers,
  saveUser,
  getUserByKeyword,
  getUserPlate,
  deleteUserById,
  updateUserById,
  assignCardToUser,
} = require("../../models/user.model");
const { getPagination } = require("../../services/query");

async function httpGetAllUsers(req, res) {
  const { skip, limit } = getPagination(req.query); // To read the body of the GET request we use req.query
  const data = await getAllUsers({ skip, limit });
  return res.status(200).json(data);
}

async function httpAddUser(req, res) {
  try {
    const user = req.body;
    const object = {
      ...user,
      date: new Date(),
    };

    await saveUser(object);
    return res.status(200).json(object);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ...error,
      message: "Maybe you entered the wrong object properties.",
    });
  }
}

async function httpGetUserByKeyword(req, res) {
  try {
    const { skip, limit } = getPagination(req.query);
    const { keyword } = req.params;
    const user = await getUserByKeyword({ keyword, skip, limit });
    if (!user || user.length == 0) {
      return res.status(404).json({
        message: `There are no matching users with the keyword: ${keyword}`,
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({
      ...error,
      message: `Sorry, we couldn't handle your request, try it later`,
    });
  }
}

async function httpGetUserPlate(req, res) {
  try {
    const { plate } = req.params;
    const user = await getUserPlate(plate);
    if (!user || user.length == 0) {
      return res.status(404).json({
        message: `There are no matching users with the keyword: ${plate}`,
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({
      ...error,
      message: `Sorry, we couldn't handle your request, try it later`,
    });
  }
}

async function httpDeleteUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await deleteUserById(id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({
      ...error,
      message: `Sorry, we couldn't handle your request, try it later`,
    });
  }
}

async function httpUpdateUserById(req, res) {
  try {
    const { id } = req.params;
    const user = req.body;
    const object = {
      ...user,
      date: new Date(),
    };
    const newUser = await updateUserById(id, object);
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(404).json({
      ...error,
      message: `Sorry, we couldn't handle your request, try it later`,
    });
  }
}

async function httpAssignCardToUser(req, res) {
  try {
    const { userID, cardID } = req.body;
    const newUser = await assignCardToUser(userID, cardID);
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(404).json({
      ...error,
      message: `Sorry, we couldn't handle your request, try it later`,
    });
  }
}

module.exports = {
  httpGetAllUsers,
  httpGetUserByKeyword,
  httpAddUser,
  httpGetUserPlate,
  httpDeleteUserById,
  httpUpdateUserById,
  httpAssignCardToUser,
};
