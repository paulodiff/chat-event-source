angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
   .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
        
  .state('app.eventSource', {
    url: '/eventSource',
    views: {
      'menuContent': {
        templateUrl: 'templates/eventSource.html',
        controller: 'eventSourceCtrl'
      }
    }
  })


  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'eventSourceCtrl'
      }
    }
  })

  .state('app.deviceOrientation', {
    url: '/deviceOrientation',
    views: {
      'menuContent': {
        templateUrl: 'templates/deviceOrientation.html',
        controller: 'deviceOrientationCtrl'
      }
    }
  })

  .state('app.mform', {
    url: '/mform',
    views: {
      'menuContent': {
        templateUrl: 'templates/mform.html',
        controller: 'mformCtrl'
      }
    }
  })

  .state('app.mformW', {
    url: '/mformW',
    views: {
      'menuContent': {
        templateUrl: 'templates/mformW.html',
        controller: 'mformWCtrl'
      }
    }
  })

  .state('app.webrtc', {
    url: '/webrtc',
    views: {
      'menuContent': {
        templateUrl: 'templates/webrtc.html',
        controller: 'webrtcCtrl'
      }
    }
  })

  .state('app.audio', {
    url: '/audio',
    views: {
      'menuContent': {
        templateUrl: 'templates/streamAudio.html',
        controller: 'streamAudioCtrl'
      }
    }
  })

  .state('app.queue', {
    url: '/queue',
    views: {
      'menuContent': {
        templateUrl: 'templates/queue.html',
        controller: 'queueCtrl'
      }
    }
  })

  .state('app.display', {
    url: '/display',
    views: {
      'menuContent': {
        templateUrl: 'templates/display.html',
        controller: 'displayCtrl'
      }
    }
  })


 .state('app.asyncUpload', {
    url: '/asyncUpload',
    views: {
      'menuContent': {
        templateUrl: 'templates/asyncUpload.html',
        controller: 'asyncUploadCtrl'
      }
    }
  })

/*
    .state('eventSource', {
      url: '/page7',
      templateUrl: 'templates/eventSource.html',
      controller: 'eventSourceCtrl'
    })

*/
    
      


  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/page7');

  $urlRouterProvider.otherwise('/app/mformW');

});