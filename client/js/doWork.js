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

      workerConfigured = true;
      console.log("workerConfigured:", workerConfigured);
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
      console.log("workerConfigured:", workerConfigured);
      if(workerConfigured){
        console.log(data);
        flow.addFile(data.files[0]);
        flow.upload();
        self.postMessage('WW:addFileList: ' + new Date().getTime());
      } else {
        self.postMessage('WW:addFileList: WORKER NOT CONFIGURED!');
      }
      break;      
    case 'showUploadStatus':
      console.log('showUploadStatus------>START');
      console.log("workerConfigured:", workerConfigured);
      console.log(data);
      console.log(flow.target);
      console.log(flow.files);
      console.log('getSize',flow.getSize());
      console.log('sizeUploaded',flow.sizeUploaded());
      console.log('timeRemaining',flow.timeRemaining());
      console.log('showUploadStatus------>END');
      self.postMessage('WW:showUploadStatus: ' + new Date().getTime());
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