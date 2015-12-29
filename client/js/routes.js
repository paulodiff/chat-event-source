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

  $urlRouterProvider.otherwise('/app/asyncUpload');

});