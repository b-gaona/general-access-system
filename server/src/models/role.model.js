const { Role } = require("./role.mongo");

async function getAllRoles({ skip, limit }) {
  return await Role.find(
    {},
    {
      __v: 0,
    }
  )
    .skip(skip) //The number of elements to skip
    .limit(limit) //The number of elements to show
    .sort({ role: 1 });
}

async function saveRole(role) {
  return await Role.create(role);
}

async function getRoleById(roleId) {
  return await Role.findById(roleId);
}

module.exports = {
  getAllRoles,
  saveRole,
  getRoleById
};
