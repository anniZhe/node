const http = require('http');
const path = require('path');
const fs = require('fs');
const config = require('./congif/default');
const mime = require('./mime');
class StaticServer {
  constructor () {
    this.port = config.port;
    this.root = config.root;
    this.indexPage = config.indexPage;
  }

  respondNotFound(req, res) {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.end(`<h1>Not Found</h1><p>The requested URL ${req.url} was not found on this server.</p>`)
  }

  respondFile(pathName, req, res) {
    const readStream = fs.createReadStream(pathName);
    res.setHeader('Content-Type', mime.lookup(pathName));
    readStream.pipe(res);
  }

  routeHandler(pathName, req, res){
    fs.stat(pathName, (err, stat) => {
      if (!err) {
        this.respondFile(pathName, req, res);
      } else {
        this.respondNotFound(req, res);
      }
    })
  }

  start () {
    http.createServer ( (req, res) => {
      const pathName = path.join(this.root, path.normalize(req.url));
      this.routeHandler(pathName, req, res);
      res.writeHead(200);
      res.end(`Qesquest path: ${pathName}`);
    }).listen(this.port, err => {
      if (err) {
        console.log(err);
        console.info('Failed to start server');
      } else {
        console.info(`Server started on port ${this.port}`);
      }
    }); 
  }
}
module.exports = StaticServer;