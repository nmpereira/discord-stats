const express = require("express");
const port = process.env.PORT || 3004;
const app = express();
const dotenv = require("dotenv").config();
const fs = require("fs");

const NODE_ENV = process.env.NODE_ENV || "Local";
const authorize_token = process.env.authorize_token;

app.listen(port, () => console.log(`The app is running on port ${port}!`));
console.log("Env:", NODE_ENV);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

if (authorize_token) {
  console.log("It is set!");
} else {
  console.log("Not set!");
}

const content = ["a", "b", "c", "d", "e", "f"];
// const content = [
//   [1373628934214, 3],
//   [1373628934218, 3],
//   [1373628934220, 1],
//   [1373628934230, 1],
//   [1373628934234, 0],
//   [1373628934237, -1],
//   [1373628934242, 0],
//   [1373628934246, -1],
//   [1373628934251, 0],
//   [1373628934266, 11],
// ];

fs.readFile("./app/content.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(data);
});
// fs.appendFile("./app/content.txt", content, (err) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   //file written successfully
// });

// content.forEach(function (v) {
//   return v + "\n";
// });

var file = fs.createWriteStream("./app/content.txt", { flags: "a" });
file.on("error", function (err) {
  /* error handling */
});
content.forEach(function (v) {
  // file.write(v.join(", ") + "\n");
  file.write(v + "\n");
});
file.end();
