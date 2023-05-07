// const socketioJwt   = require('socketio-jwt');
const changeCore = {};
changeCore.init = function (io) {
  io.use((socket, next) => {
    const apiKey = socket.handshake.headers["api-key"];

    if (apiKey == process.env.API_KEY) {
      // console.log("sokcet next");
      next();
    } else /* console.log("sokcet stop") */;
  }).on("connection", (socket) => { });
};

module.exports = changeCore;
