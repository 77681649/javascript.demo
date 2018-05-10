const http = require('http')
const fs = require('fs')
const path = require('path')

http.createServer(function (req, res) {
  const resourcePath = req.url === '/' || req.url === ''
    ? 'index.html'
    : path.join(__dirname, req.url)

  fs.exists(resourcePath, function (exists) {
    if (exists) {
      fs.createReadStream(resourcePath).pipe(res)
    } else {
      res.statusCode = 404
      res.end()
    }
  })
}).listen(3000)