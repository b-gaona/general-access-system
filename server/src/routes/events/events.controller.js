const {User} = require("../../models/user.mongo");

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

module.exports = {
  httpGetEventChanges,
};
