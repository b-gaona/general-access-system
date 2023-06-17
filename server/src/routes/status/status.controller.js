const { getAllStatus, saveStatus } = require("../../models/status.model");
const { getPagination } = require("../../services/query");

async function httpGetAllStatus(req, res) {
  const { skip, limit } = getPagination(req.query); // To read the body of the GET request we use req.query
  const data = await getAllStatus({ skip, limit });
  return res.status(200).json(data);
}

async function httpAddStatus(req, res) {
  try {
    const { plate } = req.query;

    const record = await saveStatus(plate);

    if (record) {
      return res.status(200).json(record);
    }
    return res.status(400).json({
      message: "Maybe you entered the wrong object properties.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ...error,
      message: "Maybe you entered the wrong object properties.",
    });
  }
}

module.exports = {
  httpGetAllStatus,
  httpAddStatus,
};
