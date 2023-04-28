const { OAuth2Client } = require("google-auth-library");
const CLIENTS = require("../google_client.js");

const CLIENT_ID_LIST = CLIENTS.map(client => client.VALUE);
const client = new OAuth2Client(CLIENT_ID_LIST);

module.exports = async function verifyGoogleToken (googleIdToken) {
  // console.log("before lverify");
  const ticket = await client.verifyIdToken({
    idToken: googleIdToken,
    audience: CLIENT_ID_LIST
  });
  // console.log("after lverify");

  const payload = ticket.getPayload();
  // console.log("payload");
  console.log(payload);

  return payload;
};
