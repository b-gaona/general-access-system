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
    .limit(limit) //The number of elements to show
    .sort({ date: -1 });
}

async function saveStatus(credential, location) {
  const user = await User.findOne({ "card_id.credential": credential });
  if (!user) {
    return false;
  }

  const newStatus = {
    user,
    date: new Date(),
    status: true,
    location,
  };
  return await Status.create(newStatus);

  // Code to change the status depending of the past status
  // if (user) {
  //   let status = true;
  //   const pastStatus = await Status.findOne({ user }).sort({ date: -1 });
  //   if (pastStatus) {
  //     status = !pastStatus.status;
  //   }
  //   const newStatus = {
  //     user,
  //     date: new Date(),
  //     status,
  //     location: "192.168.137.3",
  //   };
  //   return await Status.create(newStatus);
  // }
  // return false;
}

async function getStatusByKeyword({ keyword, skip, limit }) {
  const query = {
    $or: [
      { location: { $regex: new RegExp(keyword, "i") } },
      { "user.name": { $regex: new RegExp(keyword, "i") } },
      { "user.plate": { $regex: new RegExp(keyword, "i") } },
    ],
  };

  return await Status.find(query).skip(skip).limit(limit).sort({ date: -1 });
}

async function getStatusByDate({ minDate, maxDate, keyword, skip, limit }) {
  let firstFilter = {};
  let secondFilter = {};

  if (minDate || maxDate) {
    if (minDate && maxDate) {
      firstFilter = {
        date: {
          $gte: minDate,
          $lte: maxDate,
        },
      };
    } else if (minDate && !maxDate) {
      firstFilter = {
        date: {
          $gte: minDate,
        },
      };
    } else if (maxDate && !minDate) {
      firstFilter = {
        date: {
          $lte: maxDate,
        },
      };
    }
  }

  if (keyword) {
    secondFilter = {
      $or: [
        { location: { $regex: new RegExp(keyword, "i") } },
        { "user.name": { $regex: new RegExp(keyword, "i") } },
        { "user.plate": { $regex: new RegExp(keyword, "i") } },
      ],
    };
  }

  const filter = { $and: [firstFilter, secondFilter] };

  return await Status.find(filter).skip(skip).limit(limit).sort({ date: -1 });
}

async function getStatusToExport({ keyword }) {
  const pipeline = [];
  console.log(keyword);
  if (keyword) {
    pipeline.push({
      $match: {
        $or: [
          { location: { $regex: new RegExp(keyword, "i") } },
          { "user.name": { $regex: new RegExp(keyword, "i") } },
          { "user.plate": { $regex: new RegExp(keyword, "i") } },
        ],
      },
    });
  }

  pipeline.push({
    $project: {
      ubicacion: "$location",
      nombre: "$user.name",
      "matricula o numero de empleado": "$user.plate",
      status: {
        $cond: {
          if: "$status",
          then: "entrada",
          else: "salida",
        },
      },
      fecha: "$date",
      _id: 0,
    },
  });

  return await Status.aggregate(pipeline);
}

module.exports = {
  getAllStatus,
  saveStatus,
  getStatusByKeyword,
  getStatusToExport,
  getStatusByDate,
};
