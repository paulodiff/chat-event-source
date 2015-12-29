'use strict';
angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

.factory('HelloWorldService',['$q',function($q){

    var worker = new Worker('js/doWork.js');
    var defer;

    worker.addEventListener('message', function(e) {
      console.log('Worker said: ', e.data);
      defer.resolve(e.data);
    }, false);

    return {
        doWork : function(myData){
        	console.log('call doWork...');
        	console.log(myData);
            defer = $q.defer();
            worker.postMessage(myData); // Send data to our worker. 
            return defer.promise;
        }
    };

}]);