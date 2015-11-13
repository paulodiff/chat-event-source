console.log("Start....");
var app = angular.module('sse', [])
.controller("statCtrl", statCtrl);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// define the ctrl
function statCtrl($scope, $http) {

    var sourceEvent = {};

    // the last received msg
    $scope.msg = {};
    $scope.data = {};
    $scope.userData = {};
    $scope.userData.userName = "User" + getRandomInt(1,100);
    $scope.userData.channelId = getRandomInt(1,100);

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
        console.log('sendMessageAction');
        var url = '/sendMessage?msg=' + $scope.userData.message;
        console.log(url);

        $http({
            method: 'GET',
            url: url
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

      $http({
            method: 'GET',
            url: '/status'
        }).then(function successCallback(response) {
            console.log('OK');
            console.log(response);
            $scope.userData.dataList = response.data;
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

    //var source = new EventSource('/stats');
    //source.addEventListener('message', handleCallback, false);
    //source.addEventListener('popup', handlePopup, false);
}