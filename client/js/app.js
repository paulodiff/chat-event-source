// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'restangular'])

// restangular configuration
.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/rtmsg');
    RestangularProvider.setExtraFields(['name']);
    RestangularProvider.setResponseExtractor(function(response, operation) {
        return response.data;
    });

    RestangularProvider.addElementTransformer('accounts', false, function(element) {
       element.accountName = 'Changed';
       return element;
    });

    RestangularProvider.setDefaultHttpFields({cache: true});
    RestangularProvider.setMethodOverriders(["put", "patch"]);

    // In this case we are mapping the id of each element to the _id field.
    // We also change the Restangular route.
    // The default value for parentResource remains the same.
    RestangularProvider.setRestangularFields({
      id: "_id",
      route: "restangularRoute",
      selfLink: "self.href"
    });

    //RestangularProvider.setRequestSuffix('.json');

    // Use Request interceptor
    /*
    RestangularProvider.setRequestInterceptor(function(element, operation, route, url) {
      delete element.name;
      return element;
    });
    */
    // ..or use the full request interceptor, setRequestInterceptor's more powerful brother!
    /*
    RestangularProvider.setFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
      delete element.name;
      return {
        element: element,
        params: _.extend(params, {single: true}),
        headers: headers,
        httpConfig: httpConfig
      };
    });
    */
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})