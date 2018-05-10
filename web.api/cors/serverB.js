const http = require('http')
const fs = require('fs')

http.createServer(function (req, res) {
  fs.readFile('./index.html',function(err,data){
    if(err){
      res.statusCode = 500
      res.end()
    }else{
      res.statusCode = 200
      res.end(data)
    }
  })  
}).listen(2001)