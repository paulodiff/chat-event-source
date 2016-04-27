'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('app.controllers')

.controller('mformWCtrl', ['$scope', '$timeout', '$log', 'ENV' , 'HelloWorldService','$ionicPopup','$window','$ionicLoading',
                function ( $scope,   $timeout,   $log,   ENV,    HelloWorldService,  $ionicPopup, $window,$ionicLoading) {
    
    $log.debug("mformW .");

   // initializing RTCMultiConnection.js constructor.
    console.log('displayCtrl:RTCMultiConnection ... start');


  $scope.vm = {};
  $scope.vm.model = {};
  $scope.vm.model.formStep = 1;


  function setData(argument) {
    console.log('setData');
  }

  function finishWizard() {
      console.log('finishWizard');
      alert(JSON.stringify($scope.vm.model), null, 2);
  }
  $scope.vm.finishWizard = finishWizard;

    // variable assignment
    $scope.vm.author = { // optionally fill in your info below :-)
      name: 'Kent C. Dodds',
      url: 'https://twitter.com/kentcdodds' // a link to your twitter/github/blog/whatever
    };
    $scope.vm.exampleTitle = 'With angular-wizard'; // add this
    /*
    $scope.vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: formlyVersion
    };
    */

    $scope.vm.model1 = {};
    $scope.vm.model2 = {};
    $scope.vm.model3 = {};
    $scope.vm.model4 = {};
    $scope.vm.model5 = {};
    $scope.vm.model6 = {};
    $scope.vm.model7 = {};


    $scope.vm.enterValidation = function(form) {
      console.log('enterValidation');
    };
    
    $scope.vm.exitValidation = function(form) {
      console.log('exitValidation');
      console.log(form);

      return form && !form.$invalid;
    
    };


    $scope.vm.fields = {
      step1: [
        {
          key: 'email',
          "type": "stacked-input",
          templateOptions: {
            label: 'Indirizzo email valido (*)',
            type: 'email',
            placeholder: 'Email address',
            required: true
          }
        },
        {
          "type": "stacked-input",
          "key": "firstName",
          "templateOptions": {
            "type": "text",
            label: 'Inserire un nome qualsiasi',
            "placeholder": "... mario rossi ...",
            "icon": "ion-person",
            "iconPlaceholder": true
          }
        }

      ],
      step2: [
         {
                    "key": "username",
                    "type": "stacked-input",
                    "templateOptions": {
                        "type": "text",
                        "label": "Username (*)",
                        "required": true
                    }
                }, {
                    "key": "password",
                    "type": "inline-input",
                    "templateOptions": {
                        "type": "password",
                        "label": "Password"
                    }
                },
            {
              "type": "checkbox",
              "key": "checkThis",
              "templateOptions": {
                "label": "Check this box"
              }
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
      }
    },
    {
      "key": "triedEmber",
      "type": "radio",
      "templateOptions": {
        "label": "Have you tried EmberJs yet?",
         "options": [{
             "value": "A",
             "text": "A",
             "icon": "ion-home"
           }, {
             "value": "B",
             "text": "B",
           }, {
             "value": "C",
             "text": "C",
           }]
      }
    }
      ],
      step3: [
         {
    "key": "marvel3",
    "type": "select",
    "templateOptions": {
      "label": "Selezionare un valore",
      "options": [{
        "label": "Iron Man",
        "id": "iron_man",
        "gender": "Male"
      }, {
        "label": "Captain America",
        "id": "captain_america",
        "gender": "Male"
      }, {
        "label": "Black Widow",
        "id": "black_widow",
        "gender": "Female"
      }, {
        "label": "Hulk",
        "id": "hulk",
        "gender": "Male"
      }, {
        "label": "Captain Marvel",
        "id": "captain_marvel",
        "gender": "Female"
      }],
      "groupProp": "gender",
      "valueProp": "id",
      "labelProp": "label"
    }
  },
  {
          "type": "stacked-input",
          "key": "firstNumber",
          "templateOptions": {
            "type": "number",
            label: 'Inserire un numero (*)',
            "placeholder": "... numero obbligatorio ...",
            "icon": "ion-person",
            "required": true,
            "iconPlaceholder": true
          }
        }



      ]

  };



  $scope.vm.originalFields = angular.copy($scope.vm.fields);

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


