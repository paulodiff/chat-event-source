'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('app.controllers')

.controller('deviceOrientationCtrl', ['$scope', '$timeout', '$log', 'ENV' , 'HelloWorldService','$ionicPopup','$window',
                       function ($scope,   $timeout,   $log,   ENV,    HelloWorldService,  $ionicPopup, $window) {
    
    $log.debug("deviceOrientationCtrl ... start ..socket");
    $log.debug(window.location.origin + window.location.pathname);
    

    var url_origin = window.location.origin;
    var url_path = window.location.pathname + 'socket.io';
    //url_2 = url_2.replace(/\/$/, '');
    console.log(url_origin);
    console.log(url_path);
    
    var socket = io(url_origin, {path: url_path});
   
    socket.emit('subscribe', { my: 'deviceorientation', type: 'hello' });
    socket.on('news', function (data) {
      $log.debug(data);
    });

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
    $scope.userData.workerInfo = "x";
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
            type: 'data', 
            action : 'move',
            player : $scope.userData.player,
            value: $scope.userData.Xvalue  
          });


      }

      





   }


    $scope.showStatus = function(){
      $log.debug('Show status', $scope.userData.player);


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


      socket.emit('infoEvent', 
          { 
            type: 'data', 
            action : 'start',
            player : $scope.userData.player,
            value: Math.floor(Math.random() * 500) + 1  
          });

    }

    // init worker
    console.log('INIT ...');

}]);


