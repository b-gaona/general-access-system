const { saveArea, getAllAreas } = require("../../models/area.model");
const { getPagination } = require("../../services/query");

async function httpGetAllAreas(req, res) {
  const { skip, limit } = getPagination(req.query); // To read the body of the GET request we use req.query
  const data = await getAllAreas({ skip, limit });
  return res.status(200).json(data);
}

async function httpAddArea(req, res) {
  try {
    const { area } = req.params;
    const object = {
      area,
      date: new Date(),
    };
    await saveArea(object);
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
  httpGetAllAreas,
  httpAddArea,
};
