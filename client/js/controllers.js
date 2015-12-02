angular.module('app.controllers', [])
  
.controller('eventSourceCtrl', function($scope, $http) {


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
    $scope.userData = {};
    $scope.userData.userName = "User" + getRandomInt(1,100);
    $scope.userData.channelId = getRandomInt(1,100);
    $scope.channelList = [];
    $scope.userList = [];
    $scope.userOnChannelList = [];

    $scope.currentChannel = '';
    $scope.currentUser = '';
    $scope.currentUserOnChannel = '';
    


    $scope.getConnected = function (){
        return sourceEvent.readyState == 1;
    };

    $scope.connectAction = function(){

        if(sourceEvent.readyState != 1 ){
            var url = "/eventsource?userName=" + $scope.userData.userName + "&" + "channelId=" + $scope.userData.channelId;
            console.log('connect!:'+ url);
            sourceEvent = new EventSource(url);
            sourceEvent.addEventListener('message', handleCallback, false);
            sourceEvent.addEventListener('popup', handlePopup, false);
        } else {
            console.log('alredy connected!');
        }
    };
    $scope.disconnectAction = function(){
        console.log('disconnect');
        sourceEvent.close();
    };

    $scope.sendMessageAction = function(){

        if(sourceEvent.readyState != 1) {
            console.log('NOT CONNECTED!');
            return;
        }

        console.log('sendMessageAction');
        var url = '/sendMessage';
        console.log(url);

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
            url: '/status'
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


.controller('comuneDiRiminiCtrl', function($scope) {

})
   
.controller('protocollazioneAutomaticaCtrl', function($scope) {

})
   
.controller('comuneDiRimini2Ctrl', function($scope) {

})
   
.controller('introCtrl', function($scope) {

})
   
   
.controller('cameraTabDefaultPageCtrl', function($scope) {

})
   
.controller('cartTabDefaultPageCtrl', function($scope) {

})
   
.controller('cloudTabDefaultPageCtrl', function($scope) {

})
    