
var PORT = process.env.PORT || 9988;
var cors = require('cors')

var express = require('express');
var bodyParser = require('body-parser');
var server = express();

// create a demo room only
var rooms = require("./room");
var users = require("./user");
rooms.create("demo");

server.use(express.static(__dirname + "/../client"));
server.use(bodyParser.json());
server.use(require("morgan")("short"));


server.get("/rooms/:id/chats", fetchRoom, function(req, res) {
  console.log("GET /rooms/:id/chats");
  res.send(res.locals.room.latest());
});

server.post("/rooms/:id/chats", fetchRoom, function(req, res) {
  console.log("POST /rooms/:id/chats");
  var room = res.locals.room;
  room.chat(req.body);
  res.status(200).end();
});


// LIVE UPDATE!!!
server.get("/rooms/:id/events", fetchRoom, function(req, res) {
  console.log("GET /rooms/:id/events");
  var room = res.locals.room;
  var sse = startSses(res);
  
  room.on("chat", sendChat);
      
  req.once("end", function() {
    console.log("end req.once - removeListener");
    rooms.removeListener("chat", sendChat);
  });
       
  function sendChat(chat) {
    console.log("sendChat ...");
    sse("chat", chat);
  }
});

server.get("/users/:id", function(req, res) {
  console.log("GET /users/:id");
  console.log(req.params.id);
  users.get(req.params.id, function(err, user) {
    if(err) {
      return res.send(404);
    }

    res.send(user);
  });
});

server.post("/users", function(req, res) {
  console.log("POST /users/:id");
  users.create(function(err, user) {
    if(err) {
      return res.send(500);
    }

    res.send(user);
  });
});



if(require.main === module) {
  server.listen(PORT, function() {
           console.log("listening on %d", PORT);
         });
}

function startSses(res) {
  console.log("START SSE");
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write("\n");

  return function sendSse(name,data,id) {
    console.log("sendSse:" + name);
    console.log("sendSse:" + data);
    console.log("sendSse:" + id);
    res.write("event: " + name + "\n");
    if(id) res.write("id: " + id + "\n");
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }
}

function fetchRoom(req, res, next) {
  var room = rooms.get(req.params.id);
  if(room) {
    res.locals.room = room;
    next();
  } else {
    res.status(404).end();
  }
}





