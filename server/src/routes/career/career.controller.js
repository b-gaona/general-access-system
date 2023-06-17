const {
  saveCareer,
  getAllCareers,
  getCareerById,
} = require("../../models/career.model");
const { getPagination } = require("../../services/query");

async function httpGetAllCareers(req, res) {
  const { skip, limit } = getPagination(req.query); // To read the body of the GET request we use req.query
  const data = await getAllCareers({ skip, limit });
  return res.status(200).json(data);
}

async function httpAddCareer(req, res) {
  try {
    const { career, areas } = req.query;
    const object = {
      career,
      areas,
      date: new Date(),
    };

    await saveCareer(object);
    return res.status(200).json(object);
  } catch (error) {
    return res.status(400).json({
      ...error,
      message:
        "Maybe you entered duplicated data or with the wrong properties.",
    });
  }
}

async function httpGetCareerById(req, res) {
  try {
    const { id } = req.params;
    const areas = await getCareerById(id);
    return res.status(200).json(areas);
  } catch (error) {
    return res
      .status(400)
      .json({
        ...error,
        message:
          "Maybe you entered duplicated data or with the wrong properties.",
      });
  }
}

module.exports = {
  httpGetAllCareers,
  httpGetCareerById,
  httpAddCareer,
};
