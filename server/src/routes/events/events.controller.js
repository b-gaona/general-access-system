const { Credential } = require("../../models/credential.mongo");
const { User } = require("../../models/user.mongo");

async function httpGetEventChanges(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");

  User.watch().on("change", (change) => {
    const event = { type: change.operationType, data: change.fullDocument };
    const newData = JSON.stringify(event);
    res.write(`data: ${newData}\n\n`);
  });

  res.on("close", () => {
    console.log("Client closed connection");
    res.end();
  });
}

async function httpGetCredentialChanges(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");

  Credential.watch().on("change", async (change) => {
    let data = change.fullDocument;
    if (change.operationType === "update") {
      try {
        const updatedDocument = await Credential.findById(
          change.documentKey._id
        );
        data = updatedDocument;
      } catch (error) {
        console.error("Error retrieving updated document:", error);
      }
    }
    
    const event = { type: change.operationType, data };
    const newData = JSON.stringify(event);
    res.write(`data: ${newData}\n\n`);
  });

  res.on("close", () => {
    console.log("Client closed connection");
    res.end();
  });
}

module.exports = {
  httpGetEventChanges,
  httpGetCredentialChanges,
};
