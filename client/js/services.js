'use strict';
angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

.factory('HelloWorldService',['$q','ENV',function($q, ENV){


    var workerUrl = ENV.rootUrl + 'js/doWork.js';
    console.log('Call worker ', workerUrl);
    var worker = new Worker( workerUrl );
    var defer;

    worker.addEventListener('message', function(e) {
      console.log('Worker said: ', e.data);
      defer.resolve(e.data);
    }, false);

    worker.onerror = function(e) {
    	console.log('WORKER ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message);
    };

    return {
        
        doWork : function(myData){

        	console.log('call doWork...');
        	console.log(myData);
            defer = $q.defer();
            worker.postMessage(myData); // Send data to our worker. 
            return defer.promise;
        },

        doWorkS : function(myData){
        	console.log('call doWorS...');
        	var objData =
			{
				cmd: 'showUploadStatus'
			};
        	console.log(objData);

            defer = $q.defer();
            worker.postMessage(myData); // Send data to our worker. 
            return defer.promise;
        },

        doWorkF : function(myData){
        	console.log('call doWorkF...');
            
 			var objData =
			{
				cmd: 'addFileList',
			    files: myData
			};

            defer = $q.defer();

			//worker.postMessage(objData, [objData.ab]);
            worker.postMessage(objData); // Send data to our worker. 
            return defer.promise;
        },

        doWorkT : function(myData){
        	console.log('call doWorkT...');
        	console.log(myData);
            defer = $q.defer();

            var objData =
			{
			    cmd: "getWorkerTime",
			    ab: new ArrayBuffer(100)
			};

			//worker.postMessage(objData, [objData.ab, objData.i8.buffer]);
			worker.postMessage(objData, [objData.ab]);

            //worker.postMessage(myData, [myData]); // Send data to our worker. 
            return defer.promise;
        }
    };

}]);