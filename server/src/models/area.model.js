const { Area } = require("./area.mongo");

async function getAllAreas({ skip, limit }) {
  return await Area.find(
    {},
    {
      __v: 0,
    }
  )
    .skip(skip) //The number of elements to skip
    .limit(limit) //The number of elements to show
    .sort({ area: 1 });
}

async function saveArea(area) {
  return await Area.create(area);
}

async function getAreaById(areaId) {
  return await Area.findById(areaId);
}

module.exports = {
  getAllAreas,
  saveArea,
  getAreaById
};
