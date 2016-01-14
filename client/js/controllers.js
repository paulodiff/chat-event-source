angular.module('app.controllers', [])
  
.controller('eventSourceCtrl', function($scope, $http, Restangular, ENV, HelloWorldService) {

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var sourceEvent = {};

    $scope.colors = [
      {name:'black', shade:'dark'},
      {name:'white', shade:'light', notAnOption: true},
      {name:'red', shade:'dark'},
      {name:'blue', shade:'dark', notAnOption: true},
      {name:'yellow', shade:'light', notAnOption: false}
    ];


    // the last received msg
    $scope.msg = {};
    $scope.data = {};
    $scope.chatData = [];
    $scope.userData = {};
    $scope.userData.userName = "User" + getRandomInt(1,100);
    $scope.userData.channelId =  99 //getRandomInt(1,100);
    $scope.userData.message = "Welcome!" + getRandomInt(1,100);
    $scope.channelList = [];
    $scope.userList = [];
    $scope.userOnChannelList = [];

    $scope.currentChannel = '';
    $scope.currentUser = '';
    $scope.currentUserOnChannel = '';

    $scope.sendMessage2WebWorker = function(){

        console.log('sendMessage2WebWorker');
        HelloWorldService.doWork({'cmd': 'getWorkerTime', 'msg': 'test!!!!'});

    }

    $scope.getConnected = function (){
        return sourceEvent.readyState == 1;
    };

    $scope.connectAction = function(){

        console.log(ENV);

        if(sourceEvent.readyState != 1 ){

            var url = ENV.apiEndpoint + "/rtmsg/eventsource?userName=" + $scope.userData.userName + "&" + "channelId=" + $scope.userData.channelId;
            console.log('connect!:'+ url);
            sourceEvent = new EventSource(url);
            sourceEvent.addEventListener('message', handleCallback, false);
            sourceEvent.addEventListener('popup', handlePopup, false);
            sourceEvent.addEventListener('message2room', handleMessage2Room, false);
        } else {
            console.log('alredy connected!');
        }
    };
    $scope.disconnectAction = function(){
        console.log('disconnect');
        sourceEvent.close();
    };

   $scope.sendMessage2RoomAction = function(){

        if(sourceEvent.readyState != 1) {
            console.log('NOT CONNECTED!');
            return;
        }

        console.log('sendMessage2RoomAction');
        var url = ENV.apiEndpoint + '/rtmsg/sendMessage2Room';

        console.log(url);

        Restangular.all('sendMessage2Room').getList({
            msg: $scope.userData.message,
            userName: $scope.userData.userName,
            channelId : $scope.userData.channelId
        })  // GET: /users
        .then(
        function(response) {
            console.log('OK');
            console.log(response);
        },
        function errorCallback() {
            alert("Oops error from");
            console.log('>>> ERROR <<<');
        });

    };


    $scope.sendMessageAction = function(){

        if(sourceEvent.readyState != 1) {
            console.log('NOT CONNECTED!');
            return;
        }

        console.log('sendMessageAction');
        var url = '/rtmsg/sendMessage';

        console.log(url);

        Restangular.all('sendMessage').getList({
            msg: $scope.userData.message,
            userName: $scope.userData.userName,
            channelId : $scope.userData.channelId
        })  // GET: /users
        .then(
        function(response) {
            console.log('OK');
            console.log(response);
        },
        function errorCallback() {
            alert("Oops error from");
            console.log('>>> ERROR <<<');
        });

        /*

        $http({
            method: 'GET',
            url: url,
            params: {
                msg: $scope.userData.message,
                userName: $scope.userData.userName,
                channelId : $scope.userData.channelId
            }
        }).then(function successCallback(response) {
            console.log('OK');
            console.log(response);
            //$scope.userData.dataList = response.data;
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            console.log(response);
            console.log('ERR');
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            });
        */
    };


    $scope.fakeAction = function(){
        console.log('fakeAction');
        //return
        var serviziList = Restangular.all('query');
        serviziList.getList()  
            .then(function(data) {
                console.log('OK1***:');
                //console.log(data);
                console.log(data[0]);
        },
        function() {
                alert("Oops error from");
                console.log('ERROR');
        });        


        /*

         $http({
            method: 'GET',
            url: '/rtmsg/query'
        }).then(function successCallback(response) {
            console.log('OK');
            console.log(response);
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            console.log(response);
            console.log('ERR');
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            });

        */

    };

    $scope.statsAction = function(){



        console.log('statsAction');
        console.log('connection status:' + sourceEvent.readyState);

        if(sourceEvent.readyState != 1) {
            console.log('NOT CONNECTED!');
            return;
        }



      $http({
            method: 'GET',
            url: ENV.apiEndpoint + '/rtmsg/status'
        }).then(function successCallback(response) {
            console.log('OK');
            console.log(response);
            $scope.userData.dataList = response.data;

            $scope.channelList = response.data.channelList;
            $scope.userList = response.data.userList;
            $scope.userOnChannelList = response.data.userOnChannelList;

            console.log($scope.colors);
            console.log($scope.userList);
            console.log($scope.userData);


            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            console.log(response);
            console.log('ERR');
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            });
    };

    // handles the callback from the received event
    var handleMessage2Room = function (msg) {
        console.log('handleMessage2Room - START ');
        console.log(msg);
        $scope.$apply(function () {
            $scope.chatData.push(JSON.parse(msg.data));
            console.log('$scope.chatData');
            console.log($scope.chatData);
        });
        console.log('handleMessage2Room - STOP');
    }

    // handles the callback from the received event
    var handleCallback = function (msg) {
        //console.log('handleCallback');
        //console.log(msg);
        $scope.$apply(function () {
            $scope.msg = JSON.parse(msg.data);
        });
    }

    var handlePopup = function (msg) {
        console.log(msg);
        $scope.$apply(function () {
            $scope.userData.sourceMsg = msg.data;
        });
    } 





})

.controller('comuneDiRiminiCtrl', function($scope) {})
.controller('protocollazioneAutomaticaCtrl', function($scope) {})
.controller('comuneDiRimini2Ctrl', function($scope) {})
.controller('introCtrl', function($scope) {})
.controller('cameraTabDefaultPageCtrl', function($scope) {})
.controller('cartTabDefaultPageCtrl', function($scope) {})
.controller('cloudTabDefaultPageCtrl', function($scope) {})
    