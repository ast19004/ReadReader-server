const path = require("path");
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const projectId = "readreader";
const keyFilename = "google-credentials.json";

const googleStorage = new Storage({
  projectId,
  keyFilename,
});

const bucketName = "prize-images";

const bucket = googleStorage.bucket(bucketName);

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only Images are Allowed..."));
  }
};

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5MB
  },
  fileFilter: isImage,
});

exports.uploadImage = multer.single("prize_image");

exports.upload = (req, res, next) => {
  console.log("Made it to /upload");
  try {
    if (req.file) {
      console.log("File found, trying to upload...");
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.error("Error uploading file:", err);
      });

      blobStream.on("finish", () => {
        res.status(200).json({
          filename: req.file.originalname,
        });
        console.log("Success");
      });

      blobStream.end(req.file.buffer);
    } else {
      res.status(200).json({
        filename: null,
      });
    }
  } catch (error) {
    console.log(`Error: ${error.msg}`);
    res.status(500).send(error);
  }
};
