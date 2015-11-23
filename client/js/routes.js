angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('comuneDiRimini', {
      url: '/comunedirimini',
      templateUrl: 'templates/comuneDiRimini.html',
      controller: 'comuneDiRiminiCtrl'
    })
        
      
    
      
        
    .state('protocollazioneAutomatica', {
      url: '/login',
      templateUrl: 'templates/protocollazioneAutomatica.html',
      controller: 'protocollazioneAutomaticaCtrl'
    })
        
      
    
      
        
    .state('comuneDiRimini2', {
      url: '/signup',
      templateUrl: 'templates/comuneDiRimini2.html',
      controller: 'comuneDiRimini2Ctrl'
    })
        
      
    
      
        
    .state('tabsController.intro', {
      url: '/page6',
      views: {
        'tab1': {
          templateUrl: 'templates/intro.html',
          controller: 'introCtrl'
        }
      }
    })
        
      
    
      
        
    .state('eventSource', {
      url: '/page7',
      templateUrl: 'templates/eventSource.html',
      controller: 'eventSourceCtrl'
    })
        
      
    
      
        
    .state('cameraTabDefaultPage', {
      url: '/page9',
      templateUrl: 'templates/cameraTabDefaultPage.html',
      controller: 'cameraTabDefaultPageCtrl'
    })
        
      
    
      
        
    .state('tabsController.cartTabDefaultPage', {
      url: '/page10',
      views: {
        'tab2': {
          templateUrl: 'templates/cartTabDefaultPage.html',
          controller: 'cartTabDefaultPageCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.cloudTabDefaultPage', {
      url: '/page11',
      views: {
        'tab3': {
          templateUrl: 'templates/cloudTabDefaultPage.html',
          controller: 'cloudTabDefaultPageCtrl'
        }
      }
    })
        
      
    
      
    .state('tabsController', {
      url: '/page8',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/page7');

});