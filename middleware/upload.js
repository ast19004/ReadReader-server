const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const googleStorage = new Storage({
  keyFilename: "../readreader-aebdef56b5c6.json",
  projectId: "readreader",
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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit (adjust as needed)
  },
  fileFilter: isImage,
});

exports.uploadImage = upload.single("prize_image");

exports.upload = (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }
  console.log(`file: ${JSON.stringify(req.file)}`);

  const filename = `${Date.now()}_${req.file.originalname}`;
  const file = bucket.file(filename);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on("error", (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on("finish", () => {
    req.file.cloudStorageObject = filename;
    req.file.cloudStoragePublicUrl = getPublicUrl(filename);
    next();
  });

  stream.end(req.file.buffer);
  console.log(`publicUrl: ${getPublicUrl(filename)}`);
  res.status(200).json({
    filename: filename,
    publicUrl: req.file ? getPublicUrl(filename) : "",
  });
};

// Helper function to get public URL of the uploaded file
function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}

// const multerConfig = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "public/images/uploads");
//   },
//   filename: (req, file, callback) => {
//     callback(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const isImage = (req, file, callback) => {
//   if (file.mimetype.startsWith("image")) {
//     callback(null, true);
//   } else {
//     callback(new Error("Only Images are Allowed..."));
//   }
// };

// const upload = multer({
//   storage: multerConfig,
//   fileFilter: isImage,
// });
