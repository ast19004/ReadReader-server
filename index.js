if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");

const path = require("path");

const PORT = process.env.PORT || 5000;
const MONGODB_URL =
  process.env.MONGODB_URL ||
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB}.zr23rly.mongodb.net/?retryWrites=true&w=majority`;

const userRoutes = require("./routes/user");
const readerRoutes = require("./routes/reader/reader");
const readerSessionRoutes = require("./routes/reader/readerSession");
const readerPrizeRoutes = require("./routes/reader/readerPrize");
const { upload, uploadImage } = require("./middleware/upload");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "text/plain" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname + "/public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization,");
  next();
});

app.post("/upload", uploadImage, upload);
app.use(userRoutes);
app.use(readerRoutes);
app.use(readerSessionRoutes);
app.use(readerPrizeRoutes);

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
