// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'restangular', 'app.config'])




// restangular configuration
.config(function(RestangularProvider, ENV) {
    RestangularProvider.setBaseUrl(ENV.apiEndpoint + '/rtmsg');

    /*
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
    */
    // In this case we are mapping the id of each element to the _id field.
    // We also change the Restangular route.
    // The default value for parentResource remains the same.
    /*
    RestangularProvider.setRestangularFields({
      id: "_id",
      route: "restangularRoute",
      selfLink: "self.href"
    });
    */
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

    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, query) {
      console.log('addFullRequestInterceptor'); 
      console.log(element); 
      console.log(operation); 
      console.log(what); 
      console.log(url); 
      console.log(JSON.stringify(headers)); 
      console.log(JSON.stringify(query)); 
    });

    RestangularProvider.setErrorInterceptor(function(response, deferred, responseHandler) {

          switch(response.status) { 
            
            case 0: 
              console.log('Restangular.setErrorInterceptor :' + response.status);
              console.log(response);
              return false; // error handled
            break; //si ferma qui 

            case 403: 
            case 500: 
              console.log('Restangular.setErrorInterceptor :' + response.status);
              console.log(response);
              return false; // error handled            
              //istruzioni 
            break; //si ferma qui 

            default: 
              console.log('Restangular.setErrorInterceptor : DEFAULT');
              return true; // error not handled

          }

/*

            if(response.status === 0) {
              console.log('Restangular.setErrorInterceptor 0');
                    //$ionicLoading.hide();
                    //$log.debug('setErrorInterceptor 0');
                    //$rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }


            if(response.status === 403) {
                console.log('Restangular.setErrorInterceptor 403');
                    //$ionicLoading.hide();
                    //$log.debug('setErrorInterceptor 403');
                    //$rootScope.$broadcast(ENV.AUTH_EVENTS.sessionTimeout);
                    return false; // error handled
            }

            if(response.status === 500) {
              console.log('Restangular.setErrorInterceptor 500');
                    //$ionicLoading.hide();
                    //$log.debug('setErrorInterceptor 500');
                    //$rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }

            if(response.status === 502) {
              console.log('Restangular.setErrorInterceptor 502');
                    //$ionicLoading.hide();
                    //$log.debug('setErrorInterceptor 502');
                    //$rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }

            if(response.status === 504) {
              console.log('Restangular.setErrorInterceptor 504');
                    //$ionicLoading.hide();
                    //$log.debug('setErrorInterceptor 504');
                    //$rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    //return false; // error handled
            }

            if(response.status === 404) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 404');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }

*/
            //return false; // error handled
            //return true; // error not handled
        });



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

    // hide loading screen...
    console.log('hide loading screen...');
    loading_screen.finish();


  });
})