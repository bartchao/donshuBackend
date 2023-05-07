// const fs = require("fs");
const Sequelize = require("sequelize");
// var cCA = fs.readFileSync(process.env.CLIENT_SSL_LOCATION+'ca.pem');
// var cCert = fs.readFileSync(process.env.CLIENT_SSL_LOCATION+'client-cert.pem');
// var cKey = fs.readFileSync(process.env.CLIENT_SSL_LOCATION+'client-key.pem');
module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_ACCOUNT, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  pool: {
    max: 5, min: 0, idle: 10000
  },
  dialectOptions: {
    port: process.env.DB_PORT,
    charset: "utf8mb4",
    dateStrings: true,
    typeCast: true
  },
  timezone: "+08:00",
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true
  }
});
