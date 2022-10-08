const fs = require("fs");
const Sequelize = require("sequelize");
const cCA = fs.readFileSync(process.env.CLIENT_SSL_LOCATION + "ca.pem");
const cCert = fs.readFileSync(
  process.env.CLIENT_SSL_LOCATION + "client-cert.pem"
);
const cKey = fs.readFileSync(process.env.CLIENT_SSL_LOCATION + "client-key.pem");
module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_ACCOUNT,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    timezone: "+08:00",
    dialectOptions: {
      charset: "utf8mb4",
      dateStrings: true,
      typeCast: true,
      ssl: {
        key: cKey,
        cert: cCert,
        ca: cCA
      }
    },
    define: {
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: true
    }
  }
);
