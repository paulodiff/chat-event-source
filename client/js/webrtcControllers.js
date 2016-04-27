'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('app.controllers')

.controller('webrtcCtrl', ['$scope', '$timeout', '$log', 'ENV' , 'HelloWorldService','$ionicPopup','$window',
                       function ($scope,   $timeout,   $log,   ENV,    HelloWorldService,  $ionicPopup, $window) {
    



    $log.debug("webrtcCtrl ... start ..socket");
    $log.debug(window.location.origin + window.location.pathname);
    

    var url_origin = window.location.origin;
    var url_path = window.location.pathname + 'socket.io';
    //url_2 = url_2.replace(/\/$/, '');
    console.log(url_origin);
    console.log(url_path);
    
    /*
    var socket = io(url_origin, {path: url_path});
   
    socket.emit('subscribe', { my: 'deviceorientation', type: 'hello' });
    socket.on('news', function (data) {
      $log.debug(data);
    });
    */

    // initializing RTCMultiConnection.js constructor.
    console.log('RTCMultiConnection ... start');
    var connection = new RTCMultiConnection();



    // by default, socket.io server is assumed to be deployed on your own URL
    connection.socketURL = '/';
    connection.socketPath = window.location.pathname + 'socket.io';

            // comment-out below line if you do not have your own socket.io server
            // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    connection.socketMessageEvent = 'textchat-plus-fileshare-demo';

    document.getElementById('room-id').value = '9999';

    connection.enableFileSharing = true; // by default, it is "false".
    connection.session = { data: true, audio: false  };
    connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: false,
                OfferToReceiveVideo: false
    }



    // using reliable-signaler
    //var signaler = initReliableSignaler(channel, socket);


    document.getElementById('open').onclick = function() {
    var roomid = document.getElementById('room-id').value;
    if (roomid.replace(/^\s+|\s+$/g, '').length <= 0) {
        alert('Please enter room-id');
        document.getElementById('room-id').focus();
        return;
    }


    /*
    signaler.createNewRoomOnServer(roomid, function() {
        document.getElementById('open').disabled = true;
        
        channel.userid = roomid;
        channel.transmitRoomOnce = true;
        channel.open(roomid);
    });
    */

};

    document.getElementById('open-or-join-room').onclick = function() {
                console.log('open-or-join-room:',document.getElementById('room-id').value);
                this.disabled = true;
                connection.openOrJoin(document.getElementById('room-id').value);
            };
    
document.getElementById('join').onclick = function() {
    var roomid = document.getElementById('room-id').value;
    if (roomid.replace(/^\s+|\s+$/g, '').length <= 0) {
        alert('Please enter room-id');
        document.getElementById('room-id').focus();
        return;
    }
    
    this.disabled = true;
    /*
    signaler.getRoomFromServer(roomid, function(roomid) {
        channel.connect(roomid); // setting 'channel' & connecting socket
        
        // setting 'roomToken' and 'broadcaster' and joining
        channel.join({
            id: roomid,
            owner: roomid
        });
    });
    */
};

connection.onopen = function(ev) {
    document.getElementById('input-text-chat').disabled = false;
    console.log('OnOpen',ev);
};

document.getElementById('input-text-chat').onkeyup = function(e) {
    if(e.keyCode != 13) return;
    
    // removing trailing/leading whitespace
    this.value = this.value.replace(/^\s+|\s+$/g, '');

    if (!this.value.length) return;
    
    channel.send(this.value);
    appendDIV(this.value);
    this.value =  '';
};

//channel.onmessage = appendDIV;
connection.onmessage = logData;
connection.onerror = logError;
connection.onclose = logClose;

var chatContainer = document.querySelector('.chat-output');
var logContainer = document.querySelector('.log-output');


function logError(ev){
  console.log('error!', ev);
}


function logClose(ev){
  console.log('close!', ev);

}

function logData(message, userid, latency){
  
  //console.log('logData',message);
  //console.log('logData',message.extra);
  $scope.userData.workerInfo = message.data.value + "/" + message.latency;
  $scope.$apply();
  addLogDIV(message.data.value);
  console.log(message);
}

// a custom method used to append a new DIV into DOM
function appendDIV(event) {
    var div = document.createElement('div');
    div.innerHTML = event.data.value || event;
    chatContainer.insertBefore(div, chatContainer.firstChild);
    div.tabIndex = 0; div.focus();
   
    document.getElementById('input-text-chat').focus();
}


function addLogDIV(event){
    var div = document.createElement('div');
    console.log(event);
    div.innerHTML = event;
    logContainer.insertBefore(div, logContainer.firstChild);
    div.tabIndex = 0; div.focus();
}




    //HelloWorldService.doWork({'cmd': 'start', 'msg': 'Hi'});

    $scope.getWindowOrientation = function () {
        return $window.orientation;
    };
  
    $scope.$watch($scope.getWindowOrientation, function (newValue, oldValue) {
          $scope.degrees = newValue;
     }, true);

    //  orientationchange deviceorientation
    angular.element($window).bind('deviceorientation', function (event) {
      $scope.alpha = event.alpha;
      $scope.beta = event.beta;
      $scope.gamma = event.gamma;
      $scope.$apply();
    });

    $scope.uploadErrorFile = false;
    
    
    $scope.userData = {};
    $scope.userData.fileName = "x";
    $scope.userData.fileSize = "x";
    $scope.userData.fileChunkNumber = "x";
    $scope.userData.workerInfo = "1";
    $scope.userData.workerInfo2 = "2";
    $scope.userData.Files = [];
    $scope.userData.player = '';
    $scope.userData.Xvalue = 50;
    $scope.userData.delta = 20;
    var prevValue = 100000;

    console.log($scope.userData.Files);

    $scope.userData.log = "start....";

   $scope.inviaDati = function(){


      var diff = $scope.userData.Xvalue - prevValue;
      console.log(diff)
      if (Math.abs(diff) > $scope.userData.delta) {
        console.log($scope.userData.Xvalue);
        prevValue = $scope.userData.Xvalue;

        $scope.userData.workerInfo = $scope.userData.Xvalue + ' ' + $scope.userData.delta;

      socket.emit('infoEvent', 
          { 
            type: 'text', 
            action : 'move',
            player : $scope.userData.player,
            value: $scope.userData.Xvalue  
          });


      }
   }

   $scope.inviaDatiRTC = function(){

      console.log('inviaDatiRTC',$scope.userData.player + ':' + $scope.userData.Xvalue);
      $scope.userData.workerInfo2 = "send " + $scope.userData.Xvalue;
      //$scope.$apply();
       connection.send({ 
            //type: 'text', 
            action : 'move',
            //last : true,
            player : $scope.userData.player,
            player1 : $scope.userData.player,
            value: $scope.userData.Xvalue  
          });

      
   }



    $scope.showStatus = function(){
      $log.debug('Show status', $scope.userData.player);

     

     var socket = connection.getSocket();

      socket.emit('infoEvent', 
          { 
            type: 'data', 
            action : 'move',
            player : $scope.userData.player,
            value: Math.floor(Math.random() * 500) + 1  
          });
    }

    $scope.startAction = function(){

      $log.debug('startAction', $scope.userData.player);

      connection.send({ 
            //type: 'text', 
            action : 'start',
            //last : true,
            player : $scope.userData.player,
            value: 0  
          });



      
    }

    // init worker
    console.log('INIT ...');

}]);


