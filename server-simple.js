var PORT = process.env.PORT || 9988;
var express = require('express');
var cors = require('cors');
var http = require('http');
var bodyParser = require('body-parser');
var os = require('os');
var path = require('path');
var util = require('util');
 
// create the app
var app = express();
 
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

 
// simple standard errorhandler
//app.configure('development', function(){
//  app.use(express.errorHandler());
//});
 
var openConnections = [];

// get an instance of the router for api routes
var apiRoutes = express.Router(); 
 
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


// apply the routes to our application with the prefix /api
app.use('/rtmsg', apiRoutes);

app.listen(PORT, function() {
           console.log("listening on %d", PORT);
         });