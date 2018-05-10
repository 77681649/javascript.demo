const http = require('http')

http.createServer(function (req, res) {
  let origin = req.headers.origin
  let method = req.method
  let accessControlReuqestMethod = req.headers['access-control-request-method']
  let accessControlReuqestHeaders = req.headers['access-control-request-headers']

  console.log(origin)
  console.log(accessControlReuqestMethod)
  console.log(accessControlReuqestHeaders)

  if (method == 'OPTIONS' && (accessControlReuqestMethod || accessControlReuqestHeaders)) {
    if (origin == 'http://localhost:2001') {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Access-Control-Allow-Method', 'GET,POST,PUT')
      res.setHeader('Access-Control-Allow-Headers', 'content-type')
      res.end()
      return;
    }
  }

  if (origin == 'http://localhost:2001') {
    // 处理简单请求
    res.setHeader('Access-Control-Allow-Origin', origin)

    if (req.url == '/api/date' && (method == 'GET' || method == 'POST')) {
      res.end(new Date().toString())
    }
  } else {
    res.statusCode = 500
    res.end()
  }
}).listen(3000)