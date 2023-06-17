const { saveDepartment, getAllDepartments } = require("../../models/department.model");
const { getPagination } = require("../../services/query");

async function httpGetAllDepartments(req, res) {
  const { skip, limit } = getPagination(req.query); // To read the body of the GET request we use req.query
  const data = await getAllDepartments({ skip, limit });
  return res.status(200).json(data);
}

async function httpAddDepartment(req, res) {
  try {
    const { department } = req.params;
    const object = {
      department,
      date: new Date(),
    };
    await saveDepartment(object);
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
  httpGetAllDepartments,
  httpAddDepartment,
};
