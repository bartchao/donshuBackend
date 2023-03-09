const fs = require("fs");
const path = require("path");
const Model = require("../db/model/");
const errHandler = require("../util/errHandler");
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => res.send("Hello!!"));

router.get("/uploads/:upload", function (req, res) {
  const file = req.params.upload;
  console.log(req.params.upload);
  try {
    const img = fs.readFileSync(path.join(__dirname, "../../uploads/") + file);
    console.log("!!!!");
    console.log(img);
    res.writeHead(200, { "Content-Type": "image/*" });
    res.end(img, "binary");
  } catch (err) {
    console.log(err);
    errHandler(err, res);
  }
});

router.get("/apk/:apkFile", function (req, res) {
  const file = req.params.apkFile;
  const dirpath = path.join(__dirname, "../apk/");
  console.log(req.params.apkFile);
  try {
    const apk = fs.readFileSync(path.join(dirpath, file));
    console.log("!!!!");
    console.log(apk);
    res.writeHead(200, { "Content-Type": "application/vnd.android.package-archive" });
    res.end(apk);
  } catch (err) {
    console.log(err);
    errHandler(err, res);
  }
  // res download error 有點難處理，而且網路差時只會傳一半...
  // res.download(path.join(dirpath, file),file,err=>{if(err)console.error(err);});
});

module.exports = router;
