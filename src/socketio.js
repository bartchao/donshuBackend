/* eslint-disable camelcase */
const socket_io = require("socket.io");
const changecore = require("./socket/changecore");

const socketio = {};
socketio.setSocketio = (server) => {
  console.log("set socketIO ...\n".help);
  socketio.io = socket_io.listen(
    server,
    // {
    //   origins: ["http://localhost:3000"],
    //   handlePreflightRequest: (req, res) => {
    //     res.writeHead(200, {
    //       "Access-Control-Allow-Origin": "http://localhost:3000",
    //       "Access-Control-Allow-Methods": "GET,POST",
    //       "Access-Control-Allow-Headers": "api-key",
    //       "Access-Control-Allow-Credentials": true,
    //     });
    //     res.end();
    //   },
    // }
    {
      handlePreflightRequest: (req, res) => {
        const headers = {
          "Access-Control-Allow-Headers": "api-key",
          "Access-Control-Allow-Origin": req.headers.origin, // or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
      }
    }
  );
  const { io } = socketio;
  changecore.init(io);
  console.log("set socketIO successful!\n".success);
};
socketio.getSocketio = function () {
  return socketio.io;
};

module.exports = socketio;
