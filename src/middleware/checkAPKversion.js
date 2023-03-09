const fs = require("fs");
const path = require("path");
module.exports = (req, res, next) => {
  const rawInfo = fs.readFileSync(path.join(__dirname, "../apk/donshi.json"));
  const info = (JSON.parse(rawInfo))[0];
  // let {size} = fs.statSync(path.join(__dirname, '../apk/donshi.apk'));
  // info.apkSize = size;
  const { currentVersion } = req.body;
  info.updateStatus = (currentVersion < info.versionCode) ? 1 : 0;
  info.msg = (currentVersion < info.versionCode)
    ? "需要進行更新!"
    : "已經是最新版本了!";
  res.status(200).send(info);
};
