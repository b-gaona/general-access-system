const { Status } = require("./status.mongo");
const { User } = require("./user.mongo");

async function getAllStatus({ skip, limit }) {
  return await Status.find(
    {},
    {
      __v: 0,
    }
  )
    .skip(skip) //The number of elements to skip
    .limit(limit); //The number of elements to show
}

async function saveStatus(plate) {
  const user = await User.findOne({ plate });
  if (user) {
    let status = true;
    const pastStatus = await Status.findOne({ user }).sort({ date: -1 });
    if (pastStatus) {
      status = !pastStatus.status;
    }
    const newStatus = {
      user,
      date: new Date(),
      status,
      location: "192.168.137.3",
    };
    return await Status.create(newStatus);
  }
  return false;
}

module.exports = {
  getAllStatus,
  saveStatus,
};
