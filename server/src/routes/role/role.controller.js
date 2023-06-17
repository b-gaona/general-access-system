const { saveRole, getAllRoles } = require("../../models/role.model");
const { getPagination } = require("../../services/query");

async function httpGetAllRoles(req, res) {
  const { skip, limit } = getPagination(req.query); // To read the body of the GET request we use req.query
  const data = await getAllRoles({ skip, limit });
  return res.status(200).json(data);
}

async function httpAddRole(req, res) {
  try {
    const { role } = req.params;
    const object = {
      role,
      date: new Date(),
    };
    await saveRole(object);
    return res.status(200).json(object);
  } catch (error) {
    return res.status(400).json({
      ...error,
      message:
        "Maybe you entered duplicated data or with the wrong properties.",
    });
  }
}

module.exports = {
  httpGetAllRoles,
  httpAddRole,
};
