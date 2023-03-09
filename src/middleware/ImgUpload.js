const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: "../../uploads/",
  filename: function (req, file, cb) {
    return crypto.randomBytes(16, function (err, raw) {
      if (err) {
        return cb(err);
      }
      return cb(null, "" + (raw.toString("hex")) + (path.extname(file.originalname)));
    });
  }
});
// Check File Type
function checkFileType (file, cb) {
  // Allowed
  const filetypes = /jpeg|jpg|png|gif|bmp/;
  const fileMime = /image/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = fileMime.test(file.mimetype);
  return (mimetype && extname)
    ? cb(null, true)
    : cb(new Error("Images Only!"));
}
const setting = {
  storage,
  limits: { fileSize: 500000000 }, // 檔案大小限制
  fileFilter: (req, file, cb) => checkFileType(file, cb)
};
const upload = multer(setting).array("upload", 8);
// exports.getMulter =

module.exports = (req, res, next) => {
  console.log("!!!!!!!!!!!!!!!");
  console.log(req.body);
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err);
      return res.status(413).send();
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log(err);
      return res.status(500).send();
    }
    console.log(req.files);
    const response = req.files.map(file => ({ url: "/uploads/" + file.filename, fileName: file.originalname }));
    console.log(response);
    return res.status(200).send(response);
  });
};
