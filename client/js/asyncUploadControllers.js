'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('app.controllers')

.controller('asyncUploadCtrl', ['$scope', '$timeout', '$log', 'ENV' , 'HelloWorldService','$ionicPopup',
                       function ($scope,   $timeout,   $log,   ENV,    HelloWorldService,  $ionicPopup) {
    
    $log.debug("asyncUploadController ... start");

    //HelloWorldService.doWork({'cmd': 'start', 'msg': 'Hi'});

    $scope.uploadFile = function(event){
        console.log('uploadFile....');
        var files = event.target.files;
        console.log(files);
        HelloWorldService.doWorkF(files);

    };

    $scope.uploadErrorFile = false;
    $scope.userData = {};
    $scope.userData.fileName = "x";
    $scope.userData.fileSize = "xxx";
    $scope.userData.fileChunkNumber = "xxx";
    $scope.userData.workerInfo = "xxx";

    $scope.userData.log = "start....";


/*
    var imageWorker;
    $scope.blurImage = function() {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            dStart = new Date();

        imageWorker = Webworker.create(gaussianBlur);

        $scope.imageProgress = 0;
        $scope.imageDone = false;

        imageWorker.run(imageData, $scope.value / 5).then(function(result) {
            context.putImageData(result, 0, 0);
            $scope.image = canvas.toDataURL();
            $scope.imageProgress = 100;
            $scope.imageDone = true;
            imageWorker = null;
            $scope.iImageTime = ((new Date()) - dStart) / 1000;
        }, null, function(progress) {
            $scope.imageProgress = progress;
        }).catch(function(oError) {
            imageWorker = null;
            alert("stopped");
        });
*/

        /*
        getImage(canvas, context).then(function(imageData) {
            imageWorker.run(imageData, $scope.value / 5).then(function(result) {
                context.putImageData(result, 0, 0);
                $scope.image = canvas.toDataURL();
                $scope.imageProgress = 100;
                $scope.imageDone = true;
                imageWorker = null;
                $scope.iImageTime = ((new Date()) - dStart) / 1000;
            }, null, function(progress) {
                $scope.imageProgress = progress;
            }).catch(function(oError) {
                imageWorker = null;
                alert("stopped");
            });
        });
    };

    $scope.resetImage = function() {
        $scope.image = defaultImage;
    };

    $scope.stopImage = function() {
        if (imageWorker) {
            imageWorker.stop();
        }
    };
        */


// legge i messaggi dal worker
$scope.$on('msgFromWorker', function(event, args) {
    // .. Do whatever you need to do.
    console.log('msgFromWorker ... : ');
    console.log(args);

    if (args.msgType == "error"){

       var alertPopup = $ionicPopup.alert({
         title: args.msgType,
         template: args.msgData + '<br/>' + args.msgText + '<br/>' + args.msgTime
       });

    }

    if (args.msgType == "fileSuccessUpload"){

       var alertPopup = $ionicPopup.alert({
         title: args.msgType,
         template: args.msgData + '<br/>' + args.msgText + '<br/>' + args.msgTime
       });

    }


    if (args.msgType == "uploadChunk"){
        $scope.userData.fileName = args.msgData.fileName;
        $scope.userData.fileSize = args.msgData.fileSize;
        $scope.userData.progress = args.msgData.progress;
        $scope.userData.fileChunkNumber = args.msgTime + '#' + args.msgData.loaded + '#' + args.msgData.offset + '#' + args.msgData.total;
        $scope.$apply();
    }

    if (args.msgType == "showUploadStatus"){
        $scope.userData.workerInfo = args.msgTime + '#' + args.msgData.getSize + '#' + args.msgData.sizeUploaded + '#' + args.msgData.progress;
        $scope.$apply();
    }

    if ((args.msgType == "showMessage") ||  (args.msgType == "stopUpload") || (args.msgType == "resumeUpload")){
        $scope.userData.workerInfo = args.msgTime + '#' + args.msgText;
        $scope.$apply();
    }

    if (args.msgType == "fileErrorUpload") {
        $scope.uploadErrorFile = true;
        $scope.$apply();   
    }




    //$scope.userData.log = $scope.userData.log + args.message;
});


function sendMessage(message) {
  // This wraps the message posting/response in a promise, which will resolve if the response doesn't
  // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
  // a convenient wrapper.
  return new Promise(function(resolve, reject) {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function(event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply via postMessage(), which
    // will in turn trigger the onmessage handler on messageChannel.port1.
    // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller.postMessage(message,
      [messageChannel.port2]);
  });
}


    $scope.openSelectFile = function(){
        console.log('openSelectFile............');
        document.getElementById("upfile").click();
    }

   $scope.someHandlerMethod = function( $file, $message, $flow ){
    console.log('someHandlerMethod');
    console.log($file);
    console.log($message);
    console.log($flow);
   }


   $scope.uploadViaWorker = function($flow){
    console.log('uploadViaWorker');
    console.log($flow.files);
    HelloWorldService.doWorkF($flow.files);
   }

   $scope.showUploadStatusWorker = function(){
    console.log('showUploadStatusWorker');
    HelloWorldService.doWork({'cmd':'showUploadStatus'});
   }

    $scope.configureWorker = function(){
        console.log('configureWorker');
        HelloWorldService.doWork({'cmd': 'setWorkerOptions', 'msg': {
                target: window.location.origin + window.location.pathname + 'rtmsg/upload', 
                //resumeChunkSize: '512',
                chunkSize: 1*1024*100,
                //chunkSize: 1*1024,
                //forceChunkSize: true,
                simultaneousUploads: 1,
                permanentErrors: [999],
                query:{upload_token:'my_token'}
        }});
    }

    $scope.resumeUploadWorker = function(){
        console.log('resumeUploadWorker');
        HelloWorldService.doWork({'cmd': 'resumeUpload', 'msg': { 'val1' : 100, 'val2' : 300 }});
    }

    $scope.stopUploadWorker = function(){
        console.log('stopUploadWorker');
        HelloWorldService.doWork({'cmd': 'stopUpload', 'msg': { 'val1' : 100, 'val2' : 300 }});
    }

    $scope.retryUploadWorker = function(){
        console.log('retryUploadWorker');
        $scope.uploadErrorFile = false;
        HelloWorldService.doWork({'cmd': 'retryUpload', 'msg': { 'val1' : 100, 'val2' : 300 }});
    }

    $scope.uploadFiles = function(files, errFiles) {
            $scope.files = files;
            $scope.errFiles = errFiles;
            $log.debug("asyncUploadController ... uploading ....");
            /*
            angular.forEach(files, function(file) {
                file.upload = Upload.upload({
                    url: ENV.apiEndpoint + "/rtmsg/upload",
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *  evt.loaded / evt.total));
                });
            });
            */
        }

    $scope.upload = function(){
        angular.forEach($scope.files, function(file) {
                file.upload = Upload.upload({
                    url: ENV.apiEndpoint + "/rtmsg/upload",
                    //resumeChunkSize: '10KB',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    console.log('file.upload.then...');
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    console.log('file.upload.then.response:' + response.status);
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    console.log('file.upload.progress:' + evt.loaded + ':' + evt.total);
                    file.progress = Math.min(100, parseInt(100.0 *  evt.loaded / evt.total));
                });
            })
    }
}])




// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
.controller('LoginController1', 
                    [ '$scope', '$rootScope', 'ENV', 'AuthService','$state', '$log',
            function ($scope, $rootScope, ENV, AuthService,$state,$log) {
                
    $log.debug('LoginController...');
    $log.debug('LoginController...currentUser:' + $scope.currentUser );
    $log.debug('LoginController...hide nav bar');

    /*
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    document.getElementsByTagName('ion-nav-bar')[1].style.display = 'none';

    var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        };
  
    */
    $scope.credentials = {
        username: '',
        password: ''
     };
    
    
  // title ion-view
  // console.log('LoginController...set title' );
  // $scope.navTitle = '**Gestione Volontari**';
  //$scope.navTitle = '<img style="height:100px; width:auto;" src="img/logo2.jpg" />';
             
    $scope.goto_help = function($id) {
        $log.debug('HelpController : Route to login');
        $state.go('menu.help');
    };     
                
    $scope.fullscreenOn = function(){
        $log.debug('AboutController : fullscreenOn');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.request();
    };

    $scope.fullscreenOff = function(){
        $log.debug('AboutController : fullscreenOff');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.exit();
    };            
                
                
                
  $scope.login = function (credentials) {
      $log.debug('login:calling .. AuthService. ..');
      $log.debug(credentials);

    AuthService.login(credentials).then(function () {
      $rootScope.$broadcast(ENV.AUTH_EVENTS.loginSuccess);
    }, function () {
      $rootScope.$broadcast(ENV.AUTH_EVENTS.loginFailed);
    });
  };

  $scope.logout = function (credentials) {
      $log.debug('logout:calling .. AuthService. ..');
      $log.debug(credentials);
    AuthService.logout(credentials).then(function () {
      $rootScope.$broadcast(ENV.AUTH_EVENTS.logoutSuccess);
    }, function () {
      $rootScope.$broadcast(ENV.AUTH_EVENTS.logoutSuccess);
    });
  };

    
}])

// AboutController ------------------------------------------------------------------------------------
.controller('AboutController', 
            [ '$scope', '$rootScope', 'ENV', 'AuthService','Session','$location','$ionicLoading','$http', '$ionicPopup','$log',
            function ($scope, $rootScope, ENV, AuthService, Session, $location, $ionicLoading, $http, $ionicPopup,$log ) {
    $log.debug('AboutController...');
    $log.debug(Session);
    $scope.navTitle = Session.nome_breve_utenti;
    $scope.base_url = $rootScope.base_url;
                
    $scope.$location = {};
    //$ionicLoading.show({   template: 'Loading...'   });         
    angular.forEach("protocol host port path search hash".split(" "), function(method){
        $scope.$location[method] = function(){
        var result = $location[method].call($location);
        return angular.isObject(result) ? angular.toJson(result) : result;
        };
    });
    //$ionicLoading.hide();
               
                
    $scope.fullscreenOn = function(){
        $log.debug('AboutController : fullscreenOn');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.request();
    };

    $scope.fullscreenOff = function(){
        $log.debug('AboutController : fullscreenOff');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.exit();
    };
                
    $scope.test_connection = function(){
        $log.debug('AboutController : test_connection');
        $ionicLoading.show({   template: 'Loading...'   }); 
      
        $http({method: 'GET', url: $rootScope.base_url + '/mv/testconnection'}).
        success(function(data, status, headers, config) {
                $log.debug($rootScope.base_url + '/mv/testconnection');
                $log.debug(data);
                $log.debug(status);
                $log.debug(headers);
                $log.debug(config);
            
                var alertPopup = $ionicPopup.alert({
                title: 'OK!',
                template: 'Test di connessione ok'
                });
                    alertPopup.then(function(res) {
                    $log.debug('Quit popup');
                });
        }).
        error(function(data, status, headers, config) {
                $log.debug($rootScope.base_url + '/mv/testconnection');
                $log.debug(data);
                $log.debug(status);
                $log.debug(headers);
                $log.debug(config);
                var alertPopup = $ionicPopup.alert({
                title: 'Errori!',
                template: 'Test di connessione FALLITO'
                });
                    alertPopup.then(function(res) {
                    $log.debug('Quit popup');
                });
        });
        
        
        $ionicLoading.hide();
        
    };
                
                
    
}])

// HelpController ------------------------------------------------------------------------------------
.controller('HelpController', 
            [ '$scope', '$rootScope', 'ENV', 'AuthService','Session','$location','$ionicLoading','$http', '$ionicPopup','$ionicSlideBoxDelegate','$state','$log',
            function ($scope, $rootScope, ENV, AuthService, Session, $location, $ionicLoading, $http, $ionicPopup,$ionicSlideBoxDelegate,$state,$log ) {
    $log.debug('HelpController...');
    
                
        // action new relazione
    $scope.goto_login = function($id) {
        $log.debug('HelpController : Route to login');
        $state.go('menu.login');
    };            
    
}]);