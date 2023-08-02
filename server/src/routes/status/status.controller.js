const {
  getAllStatus,
  saveStatus,
  getStatusByKeyword,
  getStatusToExport,
  getStatusByDate,
} = require("../../models/status.model");
const { getPagination } = require("../../services/query");

async function httpGetAllStatus(req, res) {
  const { skip, limit } = getPagination(req.query); // To read the body of the GET request we use req.query
  const data = await getAllStatus({ skip, limit });
  return res.status(200).json(data);
}

async function httpAddStatus(req, res) {
  try {
    const { cardID, location } = req.query;

    console.log({ cardID, location });
    const record = await saveStatus(cardID, location);
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

async function httpGetStatusByKeyword(req, res) {
  try {
    const { skip, limit } = getPagination(req.query);
    const { keyword } = req.params;
    const status = await getStatusByKeyword({ keyword, skip, limit });
    if (!status || status.length == 0) {
      return res.status(404).json({
        message: `There are no matching records with the keyword: ${keyword}`,
      });
    }

    return res.status(200).json(status);
  } catch (error) {
    return res.status(404).json({
      ...error,
      message: `Sorry, we couldn't handle your request, try it later`,
    });
  }
}

async function httpGetStatusToExport(req, res) {
  try {
    const { keyword } = req.query;
    const status = await getStatusToExport({ keyword });
    if (!status || status.length == 0) {
      return res.status(404).json({
        message: `There are no matching records with the keyword: ${keyword}`,
      });
    }

    return res.status(200).json(status);
  } catch (error) {
    return res.status(404).json({
      ...error,
      message: `Sorry, we couldn't handle your request, try it later`,
    });
  }
}

async function httpGetStatusByDate(req, res) {
  try {
    const { skip, limit } = getPagination(req.query);
    const { minDate, maxDate, keyword } = req.body;
    const status = await getStatusByDate({
      minDate,
      maxDate,
      keyword,
      skip,
      limit,
    });

    if (!status || status.length == 0) {
      return res.status(404).json({
        message: `There are no matching records with the keyword: ${keyword}`,
      });
    }

    return res.status(200).json(status);
  } catch (error) {
    return res.status(404).json({
      ...error,
      message: `Sorry, we couldn't handle your request, try it later`,
    });
  }
}
module.exports = {
  httpGetAllStatus,
  httpAddStatus,
  httpGetStatusByKeyword,
  httpGetStatusToExport,
  httpGetStatusByDate,
};
