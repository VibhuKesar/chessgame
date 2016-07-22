var express = require('express');
var app = express();
app.use(express.static('public')); 
var http = require('http').Server(app);
var io = require('socket.io').listen(8080);
var count = 0

io.sockets.on('connection', function(socket) {
    count++;
    io.sockets.emit('message', { count: count });

    socket.on('disconnect', function(){
        count--;
        io.sockets.emit('message', { count: count });
    })
});

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/default.html');
});

http.listen(port, function() {
    console.log('listening on *: ' + port);
});


io.on('connection', function(socket) {
    console.log('new connection');

    // Called when the client calls socket.emit('move')
    socket.on('move', function(msg) {
       socket.broadcast.emit('move', msg); 
    });
});
