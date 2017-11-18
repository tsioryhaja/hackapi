var http = require("http");
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var objects = {

};

var user = {

};

var server = http.createServer(function (req,res) {
    fs.readFile('./index.html', 'utf-8', function (error, content) {
        /*res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(content);*/
    });
    var page = url.parse(req.url).pathname;
    var d = qs.parse(url.parse(req.url).query);
    if(page == "/opendoor") {
        objects[d['object']].emit('opendoor', 'test');
    }
    if(page == "/closedoor") {
        objects[d['object']].emit('closedoor', 'test');
    }
    if(page == "/visio") {
        objects[d['object']].emit('visio', 'test');
    }
});

var io = require('socket.io').listen(server);

io.sockets.on('connection',function (socket) {
   console.log('Client logged');
   socket.emit('auth', 'request');
   socket.on('auth', function (data) {
       var d = data.split(':');
       console.log(d[1]);
       objects[d[1]] = socket;
   });
   socket.on('presence',function(data){
       console.log('presence');
   });
   socket.on('opendoor', function (data) {
       console.log('opendoor');
       var d = data.split(':');
       objects[d[1]].emit('opendoor');
   });
   socket.on('closedoor', function (data) {
       console.log('closedoor');
       var d = data.split(':');
       objects[d[1]].emit('closedoor');
   });
});

server.listen(80);