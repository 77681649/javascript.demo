const http = require("http");
const fs = require("fs");
const path = require("path");

http
  .createServer(function(req, res) {
    let { url } = req;

    if (url === "" || url === "/") {
      url = "index.html";
    }

    fs.createReadStream(path.join(__dirname, url)).pipe(res);
  })
  .listen(80);
