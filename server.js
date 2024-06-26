const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "images", imageName);

  fs.stat(imagePath, (err, stats) => {
    if (err) {
      return res.status(404).send("Image not found");
    }

    res.header("Cache-Control", "max-age=31536000, must-revalidate");
    res.header("Last-Modified", stats.mtime.toUTCString());
    res.header("ETag", `W/"${stats.size}-${stats.mtime.getTime()}"`);
    res.header("Accept-Ranges", "bytes");

    res.sendFile(imagePath);
  });
});

app.get("/", async function (req, res) {
  return await res.status(404).json({
    success: true,
    message: "api ready to use",
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
