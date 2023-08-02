const { User } = require("./user.mongo");
const { getAreaById } = require("./area.model");
const { getCareerById } = require("./career.model");
const { getRoleById } = require("./role.model");
const { getDepartmentById } = require("./department.model");
const { getCredentialById } = require("./credential.model");

async function getAllUsers({ skip, limit }) {
  return await User.find(
    {},
    {
      __v: 0,
    }
  )
    .skip(skip) //The number of elements to skip
    .limit(limit) //The number of elements to show
    .sort({ date: -1 });
}

async function saveUser(user) {
  const role = await getRoleById(user.role);

  user.name = user.name.toUpperCase();
  if (role.role === "Alumno") {
    const { department, ...rest } = user;
    const career = await getCareerById(user.career);
    const area = await getAreaById(user.area);
    user = { ...rest, area, career, role };
  } else if (role.role === "Docente") {
    const { department, area, ...rest } = user;
    const career = await getCareerById(user.career);
    user = { ...rest, career, role };
  } else if (role.role === "Administrativo") {
    const { area, career, ...rest } = user;
    const department = await getDepartmentById(user.department);
    user = { ...rest, department, role };
  }

  return await User.create(user);
}

async function saveUserByCSV(users) {
  //This object is to avoid many fetches and optimize time, it has to be changed in a future when properties changes
  const ROLES_VALUES = {
    Alumno: "6473d89efff6f8bf7fc60f34",
    Docente: "647385e7c3539f0f971e97ec",
    Administrativo: "647385ecc3539f0f971e97ee",
  };
  const CAREERS_VALUES = {
    Administración: "646e8ce5adf2cd71f2fd6b54",
    "Mantenimiento Industrial": "646e908e8afbb6b8415453d7",
    Mecatrónica: "646e90a58afbb6b8415453db",
    "Energías Renovables": "646e90b58afbb6b8415453e1",
    "Procesos y operaciones Industriales": "646e90c68afbb6b8415453e5",
    "Tecnologías de la Información": "646e90d88afbb6b8415453ea",
  };
  const AREAS_VALUES = {
    "Formulación y Evaluación de Proyectos": "646e7b070f8d684fe07ea259",
    "Capital Humano": "646e7b2f0f8d684fe07eced7",
    Industrial: "646e7cd601f0bad89b6c0b14",
    Petróleo: "646e8dc4d1237c58138edbd4",
    Automatización: "646e8dd0d1237c58138edbd6",
    "Sistemas de Manufactura Flexible": "646e8dd9d1237c58138edbd8",
    "Instalaciones de Eléctricas Eficientes": "646e8dded1237c58138edbda",
    "Calidad y Ahorro de Energía": "646e8de6d1237c58138edbdc",
    Manufactura: "646e8decd1237c58138edbde",
    Plásticos: "646e8df4d1237c58138edbe0",
    "Desarrollo de Software Multiplataforma": "646e8dfdd1237c58138edbe2",
    "Entornos Virtuales y Negocios Digitales": "646e8e05d1237c58138edbe4",
  };

  const results = await Promise.all(
    await users.map(async (user) => {
      const { career, area, role, plate, name } = user;

      //Check that it has the properties
      if (!career || !area || !role || !plate || !name) {
        return null;
      }

      const selectedUser = await User.findOne({ plate });
      if (selectedUser) {
        return null;
      }

      const selectedRole = await getRoleById(ROLES_VALUES[role]);
      const selectedCareer = await getCareerById(CAREERS_VALUES[career]);
      const selectedArea = await getAreaById(AREAS_VALUES[area]);

      user = {
        ...user,
        role: selectedRole,
        career: selectedCareer,
        area: selectedArea,
        date: new Date(),
      };
      return user;
    })
  );

  let res = [];
  try {
    const filteredArray = results.filter((item) => item !== null);
    if (filteredArray.length > 0) {
      res = await User.insertMany(filteredArray, { ordered: false });
      console.log(res);
      if (filteredArray.length === results.length) {
        console.log("complete");
        return { status: "complete", data: res };
      } else {
        console.log("incomplete");
        return { status: "incomplete", data: res };
      }
    } else {
      console.log("empty");
      return { status: "empty", data: res };
    }
  } catch (error) {
    return { status: "error", data: res };
  }
}

async function deleteUsersByCSV(users) {
  console.log(users);
  const results = users.map((user) => {
    console.log(Object.entries(user));
    return user.plate;
  });

  let res = [];
  try {
    const filteredArray = results.filter((item) => item !== null);
    console.log(filteredArray);
    if (filteredArray.length > 0) {
      res = await User.deleteMany({plate: {$in: filteredArray}});
      console.log(res);
    } else {
      console.log("empty");
      return { status: "empty", data: res };
    }
  } catch (error) {
    return { status: "error", data: res };
  }
}

async function getUserByKeyword({ keyword, skip, limit }) {
  const query = {
    $or: [
      { name: { $regex: new RegExp(keyword, "i") } },
      { plate: { $regex: new RegExp(keyword, "i") } },
      { "area.area": { $regex: new RegExp(keyword, "i") } },
      { "career.career": { $regex: new RegExp(keyword, "i") } },
      { "role.role": { $regex: new RegExp(keyword, "i") } },
      { "department.department": { $regex: new RegExp(keyword, "i") } },
    ],
  };

  return await User.find(query).skip(skip).limit(limit).sort({ date: -1 });
}

async function getUserPlate(keyword) {
  const query = {
    $or: [
      { name: { $regex: new RegExp(keyword, "i") } },
      { plate: { $regex: new RegExp(keyword, "i") } },
      { "area.area": { $regex: new RegExp(keyword, "i") } },
      { "career.career": { $regex: new RegExp(keyword, "i") } },
      { "role.role": { $regex: new RegExp(keyword, "i") } },
      { "department.department": { $regex: new RegExp(keyword, "i") } },
    ],
  };
  const userPlate = await User.find(query, "plate -_id");
  return userPlate[0].plate;
}

async function deleteUserById(id) {
  return await User.findByIdAndDelete(id);
}

async function updateUserById(id, user) {
  const role = await getRoleById(user.role);

  if (role.role === "Alumno") {
    const career = await getCareerById(user.career);
    const area = await getAreaById(user.area);
    user = { ...user, area, career, role };
  } else if (role.role === "Docente") {
    const career = await getCareerById(user.career);
    user = { ...user, career, role };
  } else if (role.role === "Administrativo") {
    const department = await getDepartmentById(user.department);
    user = { ...user, department, role };
  }

  return await User.findByIdAndUpdate({ _id: id }, user, { new: true });
}

async function assignCardToUser(userID, cardID) {
  const credential = await getCredentialById(cardID);
  return await User.findByIdAndUpdate(
    { _id: userID },
    { card_id: credential },
    { new: true }
  );
}

module.exports = {
  getAllUsers,
  saveUser,
  getUserByKeyword,
  getUserPlate,
  deleteUserById,
  updateUserById,
  saveUserByCSV,
  deleteUsersByCSV,
  assignCardToUser,
};

//TODO: If the insertMany has errors, send a message that says that it has inserted rows, not all, but some of them.
//FIXME: Do the same as above but with the insertDelete
