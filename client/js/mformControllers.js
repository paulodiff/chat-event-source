'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('app.controllers')

.controller('mformCtrl', ['$scope', '$timeout', '$log', 'ENV' , 'HelloWorldService','$ionicPopup','$window',
                function ( $scope,   $timeout,   $log,   ENV,    HelloWorldService,  $ionicPopup, $window) {
    
    $log.debug("mform ... start ..join connection 9999");

   // initializing RTCMultiConnection.js constructor.
    console.log('displayCtrl:RTCMultiConnection ... start');


    $scope.form1 = 
    {
    "type": "input",
    "key": "nome_cognome",
    "templateOptions": {
      "type": "text",
      "placeholder": "jane doe",
      "icon": "ion-person",
      label: 'Nome e Cognome',
      "iconPlaceholder": true
    }};



  $scope.vm = {};
  $scope.vm.model = {};
  $scope.vm.model.formStep = 1;

  // note, these field types will need to be
  // pre-defined. See the pre-built and custom templates
  // http://docs.angular-formly.com/v6.4.0/docs/custom-templates
  $scope.vm.userFields = [
  {
  type: 'stacked-input',
  "key": "nome",
  "templateOptions": {
    "type": "text",
    "placeholder": "... inserire il nome",
    "icon": "ion-person",
    label: 'Nome',
    "iconPlaceholder": true
  },
  hideExpression: function($viewValue, $modelValue, scope) { return scope.model.formStep != 1; }
  },
{
  type: 'stacked-input',
  "key": "cognome",
  "templateOptions": {
    "type": "text",
    "placeholder": "... inserire il cognome",
    "icon": "ion-person",
    label: 'Cognome',
    "iconPlaceholder": true
  },
  hideExpression: function($viewValue, $modelValue, scope) { return scope.model.formStep != 1; }
  },

{
  type: 'stacked-input',
  "key": "natoa",
  "templateOptions": {
    "type": "text",
    "placeholder": "luogo di nascita",
    "icon": "ion-person",
    label: 'Nato a',
    "iconPlaceholder": true
  },
  hideExpression: function($viewValue, $modelValue, scope) { return scope.model.formStep != 1; }
  },
{
  type: 'stacked-input',
  "key": "data_nascita",
  "templateOptions": {
    "type": "text",
    "placeholder": "data di nascita es. 01/01/1970",
    "icon": "ion-person",
    label: 'Data di nascita',
    "iconPlaceholder": true
  },
  hideExpression: function($viewValue, $modelValue, scope) { return scope.model.formStep != 1; }
  },
    {
      key: 'email',
      type: 'stacked-input',
      templateOptions: {
        type: 'email',
        icon: "ion-email",
        label: 'Email address',
        placeholder: 'Enter email'
      },
      hideExpression: function($viewValue, $modelValue, scope) { return scope.model.formStep != 1; }
    },


    {
      key: 'checked1',
      type: 'checkbox',
      templateOptions: {
        label: 'Check me out1'
      },
      hideExpression: function($viewValue, $modelValue, scope) { return scope.model.formStep != 2; }
    },
    {
      key: 'checked2',
      type: 'checkbox',
      templateOptions: {
        label: 'Check me out2'
      },
      hideExpression: function($viewValue, $modelValue, scope) { return scope.model.formStep != 2; }
    },

    {
      "key": "volumeLevel",
      "type": "range",
      "templateOptions": {
        "label": "Volume",
        "rangeClass": "calm",
        "min": "0",
        "max": "100",
        "step": "5",
        "value": "25",
        "minIcon": "ion-volume-low",
        "maxIcon": "ion-volume-high"
      },
      hideExpression: function($viewValue, $modelValue, scope) { return scope.model.formStep != 2; }
    },
    {
  "key": "triedEmber",
  "type": "radio",
  "templateOptions": {
    "label": "Have you tried EmberJs yet?",
     "options": [{
         "value": "ROMA",
         "text": "ROMA",
         "icon": "ion-home"
       }, {
         "value": "MILANO",
         "text": "MILANO",
       }, {
         "value": "NAPOLI",
         "text": "NAPOLI",
       },
       {
         "value": "RIMINI",
         "text": "RIMINI",
       },
       {
         "value": "CESENA",
         "text": "CESENA",
       }]
  },
  hideExpression: function($viewValue, $modelValue, scope) { return scope.model.formStep != 3; }
},


    {
        type: 'stacked-input',
        key: 'formStep',
        templateOptions: {
          label: 'formStep',
          placeholder: "1",
        }
      },

  ];





    $scope.uploadErrorFile = false;
    $scope.userData = {};
    $scope.userData.fileName = "x";
    $scope.userData.fileSize = "xxx";
    $scope.userData.fileChunkNumber = "xxx";
    $scope.userData.workerInfo = "xxx";
    $scope.userData.Files = [];

    console.log($scope.userData.Files);

    $scope.userData.log = "start....";
    $scope.currvalue = '2';



    $scope.showStatus = function(){
      $log.debug('Show status');
      socket.emit('infoEvent', { type: 'data', val1: 33 });
    }


    $scope.nextAction= function(){
      console.log('nextAction');
      $scope.vm.model.formStep =  $scope.vm.model.formStep + 1;
      console.log($scope.vm.model.formStep);
    }

    $scope.prevAction= function(){
      console.log('nextAction');
      $scope.vm.model.formStep =  $scope.vm.model.formStep - 1;
      console.log($scope.vm.model.formStep);
    }


    // init worker
    console.log('END ...');
// RequestAnimFrame: a browser API for getting smooth animations



    // end --------------------------------------------------------

}]);


