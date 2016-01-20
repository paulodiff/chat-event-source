var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  parser = new require('xml2json'),
  fs = require('fs');

// creating the server ( localhost:8000 )
app.listen(9988);

console.log('server listening on localhost:9988');

// on server started we can load our client.html page
function handler(req, res) {
  fs.readFile(__dirname + '/client-socket-io.html', function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(500);
      return res.end('Error loading client.html');
    }
    res.writeHead(200, {'content-type':'text/html'});
    res.end(data);
  });
}

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {

  console.log(socket);

  // watching the xml file

    setInterval(function() {

        var d = new Date();
        //console.log(d.getMilliseconds());
        // send the new data to the client
        //socket.volatile.emit('notification', d.getMilliseconds());
        socket.emit('notification', d.getMilliseconds());

     
    }, 2000);


});