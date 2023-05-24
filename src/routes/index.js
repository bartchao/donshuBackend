const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => res.send("Hello!!"));

router.use("/uploads",express.static(path.join(__dirname, "../../uploads/")));
router.use("/apk",express.static(path.join(__dirname, "../../apk/")));

module.exports = router;
