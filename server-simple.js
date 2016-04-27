var PORT = process.env.PORT || 9988;
var express = require('express');
//var app = require('express').createServer();
//var app = require('express')();
//var server = require('http').Server(app);
var cors = require('cors');
var bodyParser = require('body-parser');
var os = require('os');
var fs = require('fs');
var path = require('path');
var util = require('util');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var Queue = require('bull');
var toureiro = require('toureiro');


var http = require('http');
var app = require('express')();
var server  = require('http').createServer(app);
//var server = require('http').Server(app);
//var io = require('socket.io')(server);
//var io  = require('socket.io').listen(server);

// create the app
//var app = express().createServer();

// socket.io 
//var io = require('socket.io')(app);

app.use(bodyParser.json());
app.use(require("morgan")("short"));

//app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static(__dirname + "./client"));
console.log(path.join(__dirname, './client'));
app.use(express.static(path.join(__dirname, './client')));



app.use('/queue', require('./routes/queue'));


app.use('/toureiro', toureiro({
  // Options to be passed directly to redis.createClient(),
  // see https://github.com/NodeRedis/node_redis#rediscreateclient
  redis: {
    // Redis host
    host: '10.10.128.40',
    // Port
    port: 6379,
    // DB number
    db: 0,
    password: 'password',
    auth_pass: 'password'


    // Other redis options...
  }
}));
 
// simple standard errorhandler
//app.configure('development', function(){
//  app.use(express.errorHandler());
//});

// ------------------------  socket

/*

var listOfRooms = {};


io.on('connection', 
  function (socket) {
    socket.emit('news', { hello: 'world' });

    socket.on('subscribe', 
                  function (data) {
                      console.log('subscribe');
                      console.log(data);
                  }
              );
   socket.on('infoEvent', 
                  function (data) {
                      console.log('infoEvent');
                      console.log(data);
                      console.log('emit display');
                      io.sockets.emit('display', { data: data });
                  }
              );

// ################################ reliable-signaler     

   var currentUser = socket;

        socket.on('keep-in-server', function(roomid, callback) {
            console.log('keep-in-server', roomid);
            listOfRooms[roomid] = roomid;
            currentUser.roomid = roomid;
            if(callback) callback();
        });

        socket.on('get-session-info', function(roomid, callback) {
            console.log('get-session-info', roomid);
            console.log(roomid, 'in list ..',!!listOfRooms[roomid]);
            if (!!listOfRooms[roomid]) {
                callback(listOfRooms[roomid]);
                return;
            }

            (function recursive() {
                if (currentUser && listOfRooms[roomid]) {
                    callback(listOfRooms[roomid]);
                    return
                }
                setTimeout(recursive, 1000);
            })();
        });

        socket.on('message', function(message) {
            console.log('message', message);
            socket.broadcast.emit('message', message);
        });

        socket.on('disconnect', function() {
             console.log('disconnect');
            if (!currentUser) return;

            // autoCloseEntireSession = true;
            if (currentUser && currentUser.roomid && listOfRooms[currentUser.roomid]) {
                delete listOfRooms[currentUser.roomid];
            }

            currentUser = null;
        });
        
        //   if(socketCallback) {        socketCallback(socket);      }
        
});

*/

 
var openConnections = [];

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

apiRoutes.get("/createQueue", function(req, res) {
  console.log('GET:/queue');

  var Queue = require('bull');

  redis_opts = {

    password: 'password',
    auth_pass: 'password',
    db: 0
  };

var videoQueue = Queue('video transcoding', 6379, '10.10.128.40', redis_opts);
var audioQueue = Queue('audio transcoding', 6379, '10.10.128.40', redis_opts);
var imageQueue = Queue('image transcoding', 6379, '10.10.128.40', redis_opts);

videoQueue.process(function(job, done){


  console.log('processing v1');
  // job.data contains the custom data passed when the job was created
  // job.jobId contains id of this job.

  // transcode video asynchronously and report progress
  job.progress(42);

  // call done when finished
  done();

  // or give a error if error
  done(Error('error transcoding'));

  // or pass it a result
  done(null, { framerate: 29.5 /* etc... */ });

  // If the job throws an unhandled exception it is also handled correctly
  throw (Error('some unexpected error'));
});

audioQueue.process(function(job, done){

  console.log('processing a1');

  // transcode audio asynchronously and report progress
  job.progress(42);

  // call done when finished
  done();

  // or give a error if error
  done(Error('error transcoding'));

  // or pass it a result
  done(null, { samplerate: 48000 /* etc... */ });

  // If the job throws an unhandled exception it is also handled correctly
  throw (Error('some unexpected error'));
});

imageQueue.process(function(job, done){

  console.log('processing img1');

  // transcode image asynchronously and report progress
  job.progress(42);

  // call done when finished
  done();

  // or give a error if error
  done(Error('error transcoding'));

  // or pass it a result
  done(null, { width: 1280, height: 720 /* etc... */ });

  // If the job throws an unhandled exception it is also handled correctly
  throw (Error('some unexpected error'));
});

videoQueue.pause().then(function(){
  console.log('v1 paused!');

  videoQueue.add({video: 'http://example.com/video1.mov'});
  audioQueue.add({audio: 'http://example.com/audio1.mp3'});
  imageQueue.add({image: 'http://example.com/image1.tiff'});

});

videoQueue.count().then(function(vvv){
  console.log('count');
  console.log(vvv);
});






  res.status(241).send({msg : 'queue ok'});
});



 
apiRoutes.post("/status", function(req, res) {
  console.log('POST:/status');

  res.status(241).send();
});


apiRoutes.get("/status", function(req, res) {
  console.log("GET /status ...");
  //console.log(util.inspect(openConnections));

  // costruisce la lista delle connessioni e la invia in risposta
  var userOnChannelList = [];
  var channelList = [];
  var userList = [];
  var data = {};
  
  openConnections.forEach(function(resp) {

        //data.push(resp.userName + " " + resp.channelId);
        if (channelList.indexOf(resp.channelId) == -1){
          var jsonData = {};
          jsonData["channelId"] = resp.channelId;
          channelList.push(jsonData);
        }
        if (userList.indexOf(resp.userName) == -1){
          var jsonData = {};
          jsonData["userName"] = resp.userName;
          userList.push(jsonData);
        }

        var jsonData = {};
        jsonData["userOnChannel"] = resp.userName + " " + resp.channelId;
        userOnChannelList.push(jsonData);

    });

  data = {
    "channelList" : channelList,
    "userList" : userList,
    "userOnChannelList": userOnChannelList
  };

  console.log(data);
  res.send(data);


  // forza la generazione di messaggi
  openConnections.forEach(function(resp) {
        var d = new Date();
        console.log('STATS live to : ' + resp.userName + " " + d.getMilliseconds());
        resp.write('id: ' + d.getMilliseconds() + '\n');
        resp.write('data:' + createMsg() +   '\n\n'); // Note the extra newline
  });

});


// sendMessage2Room
apiRoutes.get('/sendMessage2Room', function(req, res) {
  console.log('/sendMessage2Room');
  console.log(req.query.msg);

  // broadcast dei messaggi
  
  openConnections.forEach(function(resp) {

        // controllo se sullo stesso channelId
        console.log('check: ' + resp.channelId + '  =  ' + req.query.channelId);
        if (resp.channelId == req.query.channelId){
          console.log('message ' + req.query.msg);
          resp.write('event: message2room\n');
          resp.write('data: { "userName":"' + req.query.userName + '", "channelId":"' + req.query.channelId + '", "msg": "' + req.query.msg + '" }\n\n'); // Note the extra newline
        } else {

        }

  });

  res.send(['ok']);

});


// simple route to register the clients
apiRoutes.get('/sendMessage', function(req, res) {
  console.log('/sendMessage');
  console.log(req.query.msg);
  res.send('ok');

  // broadcast dei messaggi
  
  openConnections.forEach(function(resp) {
        var d = new Date();
        console.log('STATS live to : ' + req.query.msg + " " + d.getMilliseconds());
        resp.write('event: popup\n');
        resp.write('data:' + req.query.userName + ':' + req.query.msg +   '\n\n'); // Note the extra newline
  });

});
 
// simple req without data
apiRoutes.get('/query', function(req, res) {
    console.log('/query');
    var d = new Date();
    fakedata = [
    {
      "mms" : d.getMilliseconds(),
      "mms1" : d.getMilliseconds(),
    },
    {
      "mms" : d.getMilliseconds(),
      "mms1" : d.getMilliseconds(),
    }
    ];
    console.log(fakedata);
    res.send(fakedata);
});

// simple route to register the clients
apiRoutes.get('/eventsource', function(req, res) {
 
    console.log('/eventsource');
    console.log(req.query.userName);
    console.log(req.query.channelId);

    // set timeout as high as possible
    req.socket.setTimeout(1000000000000000);
    console.log("opening connection ...");
    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
 
    res.userName = req.query.userName;
    res.channelId = req.query.channelId;

    // push this res object to our global variable
    openConnections.push(res);
 
    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
        var toRemove;
        for (var j =0 ; j < openConnections.length ; j++) {
            if (openConnections[j] == res) {
                toRemove =j;
                break;
            }
        }
        openConnections.splice(j,1);
        console.log("closing connection ...");
        console.log(openConnections.length);
    });
});
 
setInterval(function() {
    // we walk through each connection
    openConnections.forEach(function(resp) {
        var d = new Date();
        console.log('live to : ' + resp.userName + " " + d.getMilliseconds());
        resp.write('id: ' + d.getMilliseconds() + '\n');
        resp.write('data:' + createMsg() +   '\n\n'); // Note the extra newline
    });
 
}, 2000);
 
function createMsg() {
    msg = {};
 
    msg.hostname = os.hostname();
    msg.type = os.type();
    msg.platform = os.platform();
    msg.arch = os.arch();
    msg.release = os.release();
    msg.uptime = os.uptime();
    msg.loadaverage = os.loadavg();
    msg.totalmem = os.totalmem();
    msg.freemem = os.freemem();
 
    return JSON.stringify(msg);
};
 
// startup everything
//http.createServer(app).listen(app.get('port'), function(){
//  console.log("Express server listening on port " + app.get('port'));
//})


//https://github.com/flowjs/flow.js
//https://github.com/flowjs/flow.js/tree/master/samples/Node.js

// Configure access control allow origin header stuff
var ACCESS_CONTROLL_ALLOW_ORIGIN = false;
process.env.TMPDIR = 'tmp';
var DW_PATH = (path.join(__dirname, './download'));
console.log('DW_PATH',DW_PATH);


var flow = require('./flow-node.js')('tmp');

apiRoutes.post('/upload', multipartMiddleware, function(req, res) {
  console.log('/upload call $flow.post ...');
  flow.post(req, function(status, filename, original_filename, identifier) {
    console.log('callback POST', status, original_filename, identifier);
    console.log('status', status);
    console.log('original_filename', original_filename);
    console.log('identifier', identifier);

    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }

    if (status == 'partly_done') {
      status = 200;
    }

    if (status == 'done') {

      var dw_fileName = DW_PATH + "/" + original_filename;
      console.log('writing ...',dw_fileName);
      var stream = fs.createWriteStream(dw_fileName);
      flow.write(identifier, stream);
      //stream.on('data', function(data){...});
      //stream.on('finish', function(){...});
      
      status = 200;
    }

    if (status == 'invalid_flow_request')  {   status = 501;  } 
    if (status == 'non_flow_request')      {   status = 501;  } 
    if (status == 'invalid_flow_request1') {   status = 501;  } 
    if (status == 'invalid_flow_request2') {   status = 502;  } 
    if (status == 'invalid_flow_request3') {   status = 503;  } 
    if (status == 'invalid_flow_request4') {   status = 504;  } 

    res.status(status).send();
  });
});

apiRoutes.options('/upload', function(req, res){
  console.log('OPTIONS');
  if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.status(200).send();
});

// Handle status checks on chunks through Flow.js
apiRoutes.get('/upload', function(req, res) {
  flow.get(req, function(status, filename, original_filename, identifier) {
    console.log('GET', status);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }

    if (status == 'found') {
      status = 200;
    } else {
      status = 204;
    }

    res.status(status).send();
  });
});

apiRoutes.get('/download/:identifier', function(req, res) {
  console.log('Get /download/identifier : '+ req.params.identifier);
  flow.write(req.params.identifier, res);
});

// apply the routes to our application with the prefix /api
app.use('/rtmsg', apiRoutes);

server.listen(PORT, function() {
  console.log("listening on %d", PORT);
}); // not 'app.listen'!

srv = server.listen(process.env.PORT || 9908, process.env.IP || "0.0.0.0", function() {
    var addr = server.address();
    console.log("Server listening at ", addr.address + ":" + addr.port, " ", new Date());
});

require('./Signaling-Server.js')(srv, function(socket) {
    try {
        var params = socket.handshake.query;
        console.log(params);

        // "socket" object is totally in your own hands!
        // do whatever you want!

        // in your HTML page, you can access socket as following:
        // connection.socketCustomEvent = 'custom-message';
        // var socket = connection.getSocket();
        // socket.emit(connection.socketCustomEvent, { test: true });

        if (!params.socketCustomEvent) {
            params.socketCustomEvent = 'custom-message';
        }


        socket.on('infoEvent',function(message) {
          console.log('infoEvent emit...',message);
        });

        socket.on(params.socketCustomEvent, function(message) {
            try {
                console.log('emit',params.socketCustomEvent);
                console.log('emit',message);
                socket.broadcast.emit(params.socketCustomEvent, message);
            } catch (e) {
              console.log('Errore emit...',e);
            }
        });
    } catch (e) {
      console.log('Errore handshake...',e);
    }
});


/*
app = app.listen(process.env.PORT || 9001, process.env.IP || "0.0.0.0", function() {
    var addr = app.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});
*/

/*
app.listen(PORT, function() {
  console.log("listening on %d", PORT);
});
*/