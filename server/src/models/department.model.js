const { Department } = require("./department.mongo");

async function getAllDepartments({ skip, limit }) {
  return await Department.find(
    {},
    {
      __v: 0,
    }
  )
    .skip(skip) //The number of elements to skip
    .limit(limit) //The number of elements to show
    .sort({ department: 1 });
}

async function saveDepartment(department) {
  return await Department.create(department);
}

async function getDepartmentById(departmentId) {
  return await Department.findById(departmentId);
}

module.exports = {
  getAllDepartments,
  saveDepartment,
  getDepartmentById,
};
