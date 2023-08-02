const { Credential } = require("./credential.mongo");

async function getAllCredentials({ skip, limit }) {
  return await Credential.find(
    {},
    {
      __v: 0,
    }
  )
    .skip(skip) //The number of elements to skip
    .limit(limit) //The number of elements to show
    .sort({ date: 1 });
}

async function saveCredential(credential) {
  return await Credential.findOneAndUpdate(
    { credential: credential.credential },
    credential,
    { upsert: true, new: true }
  );
}

async function getCredentialById(credentialId) {
  return await Credential.findById(credentialId);
}

module.exports = {
  getAllCredentials,
  saveCredential,
  getCredentialById,
};
