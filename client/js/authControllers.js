'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('app.controllers')




.controller("AppCtrl", 
                    ['$scope', '$rootScope', '$state','$ionicLoading', '$ionicPopup','$ionicSideMenuDelegate', 'ENV', '$log',
            function($scope,   $rootScope,   $state, $ionicLoading,   $ionicPopup,  $ionicSideMenuDelegate,   ENV,    $log) {
              

              $log.debug("VOID! AppCtrl ... start");


        $rootScope.$on('$stateChangeStart', function (event, next) {
            $log.debug('AppCtrl $stateChangeStart: ' + event);
            $log.debug('AppCtrl $stateChangeStart: ' + next.accessLogged);

/*
                        
            if(next.accessLogged){
                $log.debug('$stateChangeStart: check if isAuthenticated : ' + AuthService.isAuthenticated());
                if(!AuthService.isAuthenticated()){
                    event.preventDefault();    
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.notAuthenticated);
                }
            } else {
                $log.debug('$stateChangeStart: PATH free');
            }
*/            
            /*
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (AuthService.isAuthenticated()) {
                        // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
            */
        });


}])                



/*
.controller("AppCtrl", 
                    ['$scope', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','$ionicLoading', '$ionicPopup','$ionicSideMenuDelegate', 'ENV', '$log',
            function($scope,   $rootScope,   AuthService,   Session,   Restangular,  $state, $ionicLoading,   $ionicPopup,  $ionicSideMenuDelegate,   ENV, $log) {

                
        $log.debug("AppCtrl ... start");
        $log.debug(ENV);
        $scope.currentUser = null;
        $scope.userRoles = ENV.USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;
    
        $scope.go = function ( path ) {
            $log.debug("AppCtrl ... go");
            $state.go(path);
        };
                
        if(window.ionic){
            $log.debug('IONIC defined! : ' + window.ionic.version);
        }
                
        $scope.toggleLeft = function() {
             $log.debug("AppCtrl ... toggleLeft");
             $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        };
          
        // CONFIGURAZIONI -----------------------------------------------------------------        
                
        $rootScope.base_url = ENV.apiEndpoint;
        $log.debug('Restangular set base Url '+ ENV.apiEndpoint);
        Restangular.setBaseUrl($rootScope.base_url);
        
         Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {

            if(response.status === 0) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 0');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }


            if(response.status === 403) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 403');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.sessionTimeout);
                    return false; // error handled
            }

            if(response.status === 500) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 500');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }

            if(response.status === 502) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 502');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }

            if(response.status === 504) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 504');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }

            if(response.status === 404) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 404');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }


            //return false; // error handled
            return true; // error not handled
        });


  
                
        //$log.debug('WEB SERVICE WEB URL  : ' + $rootScope.base_url);
                
        
        //AUTH_EVENTS.loginFailed
    
        $rootScope.$on(ENV.AUTH_EVENTS.loginSuccess , function (event, next) {
            $log.debug('AppCtrl: AUTH_EVENTS.loginSuccess ... ');
            $log.debug(event);
            $log.debug(next);
            $scope.currentUser = Session.nome_breve_utenti;
            Restangular.setDefaultHeaders({'rr-access-token': Session.token});
            //Restangular.setDefaultRequestParams({ apiKey: Session.token });
            //$state.go('menu.list');
            $state.go(ENV.routeAfterLogon);
        });
                
                
        $rootScope.$on(ENV.AUTH_EVENTS.logoutSuccess , function (event, next) {
            $log.debug('AppCtrl: AUTH_EVENTS.logoutSuccess ... ');
            $log.debug(event);
            $log.debug(next);
            $scope.currentUser = '';
            Session.token = '123';
            Restangular.setDefaultHeaders({token: ''});
            $state.go('menu.home');
        });        
                
   
        $rootScope.$on(ENV.AUTH_EVENTS.loginFailed, function (event, next) {
            $log.debug('AppCtrl: AUTH_EVENTS.loginFailed ... ');
            $log.debug(event);
            $log.debug(next);
             
            
            var alertPopup = $ionicPopup.alert({
                title: 'Login errato',
                template: 'Immettere nome utente e password corrette'
            });
           alertPopup.then(function(res) {
                $log.debug('AppCtrl : Login errato OK');
                $state.go('menu.home');
           });
        }); 

    
    
         $rootScope.$on(ENV.AUTH_EVENTS.notAuthenticated, function (event, next) {
            $log.debug('AUTH_EVENTS.notAuthenticated ... ');
            $log.debug(event);
            $log.debug(next);
            $scope.currentUser = '';
            
             var alertPopup = $ionicPopup.alert({
                title: 'Utente non autenticato',
                template: 'Immettere nome utente e password'
                });
            alertPopup.then(function(res) {
             $log.debug('AppCtrl: alertPopup : OK');
                $state.go('menu.home');
           });
            
        }); 


        $rootScope.$on(ENV.AUTH_EVENTS.sessionTimeout, function (event, next) {
            $log.debug('AUTH_EVENTS.sessionTimeout ... ');
            $log.debug(event);
            $log.debug(next);
            $scope.currentUser = '';
            
             var alertPopup = $ionicPopup.alert({
                title: 'Utente non autenticato o sessione di lavoro scaduta',
                template: 'Immettere nome utente e password'
                });
            alertPopup.then(function(res) {
             $log.debug('AppCtrl: alertPopup : OK');
                $state.go('menu.home');
           });

        }); 

        $rootScope.$on(ENV.AUTH_EVENTS.serverError, function (event, next) {
            $log.debug('AUTH_EVENTS.serverError ... ');
            $log.debug(event);
            $log.debug(next);
            $scope.currentUser = Session.nome_breve_utenti;
            
             var alertPopup = $ionicPopup.alert({
                title: 'ERRORE di SISTEMA!',
                template: 'Contattare il gestore del sistema!'
                });
            alertPopup.then(function(res) {
             $log.debug('AppCtrl: alertPopup : OK');
                $state.go('menu.home');
           });

        }); 

    
        $rootScope.$on('$stateChangeStart', function (event, next) {
            $log.debug('$stateChangeStart: ' + next.accessLogged);
                        
            if(next.accessLogged){
                $log.debug('$stateChangeStart: check if isAuthenticated : ' + AuthService.isAuthenticated());
                if(!AuthService.isAuthenticated()){
                    event.preventDefault();    
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.notAuthenticated);
                }
            } else {
                $log.debug('$stateChangeStart: PATH free');
            }
            
        });
}])

*/

// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
.controller('LoginController', 
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