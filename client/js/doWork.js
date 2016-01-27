//importScripts('resumable.js');  
importScripts('flow.js');  

console.log(Flow.version);


/*
var r = new Resumable({
  target:'/rtmsg/upload', 
  query:{upload_token:'my_token'}
});
*/
var flow = {};
var uniqueIdentifierInError = '';
var workerConfigured = false;

//console.log(flow.version);
//console.log(flow.support);

self.addEventListener('message', function(e) {
  var data = e.data;
  console.log('doWork.js');
  console.log(e);
  switch (data.cmd) {

    case 'setWorkerOptions':
      console.log('setWorkerOptions');
      console.log(data.msg);
      console.log("workerConfigured:", workerConfigured);
      self.postMessage('WORKER*CONFIGURATION: ' + data.msg);

      flow = new Flow(data.msg);

      
      flow.on('fileAdded', function(file, event){
        console.log('on fileAdded : ',flow.files.length);
        console.log(file, event);


        
      });

      flow.on('fileRetry', function(file, event){
        console.log('fileRetry');
        console.log(file, event);
      });

      flow.on('fileSuccess', function(file, message, chunk){
        console.log('fileSuccess');
        console.log(file,message, chunk);

        self.postMessage({ 
            'msgType' : 'fileSuccessUpload', 
            'msgTime' : new Date().getTime(),
            'msgData' : {
               'fileName' : file.name,
               'fileSize' : file.size,
               'loaded'   : chunk.loaded, 
               'offset'   : chunk.offset,
               'total'    : chunk.total,
               'progress' : flow.progress()
            }, 
            'msgText' : 'Worker fileSuccessUpload'
         });

        //   flow.write() to filesystem!


      });

      flow.on('fileError', function(file, message){
        console.log('fileErrorUpload');
        console.log(file, message);


        uniqueIdentifierInError = file.uniqueIdentifier;
        console.log('UID in error:', uniqueIdentifierInError);


        self.postMessage({ 
          'msgType' : 'fileErrorUpload', 
          'msgTime' : new Date().getTime(),
          'msgData' : {}, 
          'msgText' : message + 'UID:' + uniqueIdentifierInError
        });
      });

      flow.on('fileProgress', function(file, chunk){
        console.log('fileProgress');
        console.log(file, chunk);


     var fileInfo = [];
      var i = 0;
      for(i=0;i<flow.files.length;i++){
          console.log('fileAdded : adding file ..', flow.files[i].name);
          fileInfo[i]  = {
              'name' : flow.files[i].name,
              'error' : flow.files[i].error,
              'paused' : flow.files[i].paused,
              'size' : flow.files[i].size,
              'uniqueIdentifier' : flow.files[i].uniqueIdentifier,
              '_prevProgress' : flow.files[i]._prevProgress
            }
        }

        console.log(fileInfo);
        console.log('sizeUploaded',flow.sizeUploaded());
        console.log('progress',flow.progress());
        console.log('timeRemaining',flow.timeRemaining());

        self.postMessage({ 
          'msgType' : 'uploadChunk', 
          'msgTime' : new Date().getTime(),
          'msgData' : {
             'getSize': flow.getSize(), 
             'sizeUploaded' : flow.sizeUploaded(),
             'progress' : flow.progress(),
             'timeRemaining' : flow.timeRemaining(),
             'files' : fileInfo
          }, 
          'msgText' : 'Worker upload status'
        });



  
      }); //OnfileProgress

      workerConfigured = true;
      console.log("workerConfigured:", workerConfigured);

        self.postMessage({ 
          'msgType' : 'showMessage', 
          'msgTime' : new Date().getTime(),
          'msgData' : {}, 
          'msgText' : 'Worker configured!:' + data.msg.chunkSize
        });


      break;
    
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg);
      break;
    
    case 'getWorkerTime':
    
      console.log(data.cmd);
      console.log(data.msg);
      console.log(data);
      self.postMessage('WORKER*TIME: ' + new Date().getTime());
      break;      
    
    case 'addFileList':

        console.log("addFileList:", workerConfigured);    

        for(i=0;i<data.files.length;i++){
          console.log('adding file ..', data.files[i]);
          flow.addFile(data.files[i]);
        }

        console.log('addFileList : ',flow.files.length);


    // return a list of fileInfo
      var fileInfo = [];
      var i = 0;
      for(i=0;i<flow.files.length;i++){
          console.log('fileAdded : adding file ..', flow.files[i].name);
          fileInfo[i]  = {
              'name' : flow.files[i].name,
              'error' : flow.files[i].error,
              'paused' : flow.files[i].paused,
              'size' : flow.files[i].size,
              'uniqueIdentifier' : flow.files[i].uniqueIdentifier,
              '_prevProgress' : flow.files[i]._prevProgress
            }
        }

        console.log(fileInfo);

        self.postMessage({ 
          'msgType' : 'showUploadStatus', 
          'msgTime' : new Date().getTime(),
          'msgData' : {
             'getSize': flow.getSize(), 
             'sizeUploaded' : flow.sizeUploaded(),
             'progress' : flow.progress(),
             'timeRemaining' : flow.timeRemaining(),
             'files' : fileInfo
          }, 
          'msgText' : 'Worker upload status'});

      break;      

    case 'startUpload':
        console.log("startUpload:", workerConfigured);    
        flow.upload();
    break;
    
    case 'showUploadStatus':

    if(workerConfigured){

      console.log('showUploadStatus------>START');
      console.log("workerConfigured:", workerConfigured);
      console.log(data);
      console.log(flow.target);
      console.log(flow.files);
      console.log('getSize',flow.getSize());
      console.log('sizeUploaded',flow.sizeUploaded());
      console.log('timeRemaining',flow.timeRemaining());
      console.log('progress',flow.progress());
      console.log('showUploadStatus------>END');
        
      var fileInfo = [];
      for(i=0;i<flow.files.length;i++){
          console.log('adding file ..', flow.files[i].name);
          fileInfo[i]  = {
              'name' : flow.files[i].name,
              'error' : flow.files[i].error,
              'paused' : flow.files[i].paused,
              'sized' : flow.files[i].sized,
              'uniqueIdentifier' : flow.files[i].uniqueIdentifier,
              '_prevProgress' : flow.files[i]._prevProgress
            }
          //flow.addFile(flow.files[i]);
        }

        console.log(fileInfo);

        self.postMessage({ 
          'msgType' : 'showUploadStatus', 
          'msgTime' : new Date().getTime(),
          'msgData' : {
             'getSize': flow.getSize(), 
             'sizeUploaded' : flow.sizeUploaded(),
             'progress' : flow.progress(),
             'timeRemaining' : flow.timeRemaining(),
             'files' : fileInfo
          }, 
          'msgText' : 'Worker upload status'});
        
    } else {
        self.postMessage({ 
                  'msgType' : 'error',   
                  'msgTime' : new Date().getTime(),
                  'msgData' : [123], 
                  'msgText' : 'Worker not configurated'});
      }

      break;        

    case 'retryUpload':
        console.log('retryUpload');



        flow.getFromUniqueIdentifier(uniqueIdentifierInError).retry();


        self.postMessage({ 
          'msgType' : 'fileRetryUpload', 
          'msgTime' : new Date().getTime(),
          'msgData' : {}, 
          'msgText' : 'File upload retried!'
        });

      break;

    case 'stopUpload':
        console.log('stopUpload');
        flow.pause();
        self.postMessage({ 
          'msgType' : 'fileStopUpload', 
          'msgTime' : new Date().getTime(),
          'msgData' : {}, 
          'msgText' : 'File upload paused!'
        });

      break;

    case 'resumeUpload':

        console.log('resumeUpload');
        flow.resume();
        self.postMessage({ 
          'msgType' : 'fileResumeUpload', 
          'msgTime' : new Date().getTime(),
          'msgData' : {}, 
          'msgText' : 'File upload resumed!'
        });


      break;

    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg + '. (buttons will no longer work)');
      self.close(); // Terminates the worker.
      break;
    default:

      self.postMessage('WWUnknown command: ' + data.msg);
      console.log('WWUnknown command: ');
      console.log(e);
      console.log(data);
  };
}, false);
console.log('doWork.js ... loaded!');