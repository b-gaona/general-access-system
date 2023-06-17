const { Area } = require("./area.mongo");
const { Career } = require("./career.mongo");

async function getAllCareers({ skip, limit }) {
  return await Career.find(
    {},
    {
      __v: 0,
    }
  )
    .skip(skip) //The number of elements to skip
    .limit(limit) //The number of elements to show
    .sort({ career: 1 });
}

async function saveCareer(career) {
  const areas = career.areas.split(", ");
  const arrayOfAreas = await Area.find({ area: { $in: areas } });
  const newCareer = { ...career, areas: arrayOfAreas };
  return await Career.findOneAndUpdate(
    { career: newCareer.career },
    newCareer,
    { upsert: true }
  );
}

async function getCareerById(careerId) {
  return await Career.findById(careerId);
}

module.exports = {
  getAllCareers,
  saveCareer,
  getCareerById,
};

//TODO: Modify the saveCareer method to add a new career using POST request
