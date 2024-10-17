const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Set up storage for images using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");  
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files from 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// POST route for saving image
app.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).json({ message: "Image saved successfully!", imagePath: `/images/${req.file.filename}` });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
