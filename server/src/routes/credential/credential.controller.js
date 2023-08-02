const {
  saveCredential,
  getAllCredentials,
  getCredentialById,
} = require("../../models/credential.model");
const { getPagination } = require("../../services/query");

async function httpGetAllCredentials(req, res) {
  const { skip, limit } = getPagination(req.query); // To read the body of the GET request we use req.query
  const data = await getAllCredentials({ skip, limit });
  return res.status(200).json(data);
}

async function httpAddCredential(req, res) {
  try {
    const { credential } = req.params;
    const object = {
      credential,
      date: new Date(),
    };
    await saveCredential(object);
    return res.status(200).json(object);
  } catch (error) {
    return res.status(400).json({
      ...error,
      message:
        "Maybe you entered duplicated data or with the wrong properties.",
    });
  }
}

async function httpGetCredentialById(req, res) {
  try {
    const { id } = req.params;
    const credential = await getCredentialById(id);
    return res.status(200).json(credential);
  } catch (error) {
    return res.status(400).json({
      ...error,
      message:
        "Maybe you entered duplicated data or with the wrong properties.",
    });
  }
}

module.exports = {
  httpGetAllCredentials,
  httpAddCredential,
  httpGetCredentialById,
};
