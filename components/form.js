//Add or Edit an Activity Modal, refactor into a service?

WhatNowApp.directive('openActivityForm',function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            icon: '@'
        },
        template: '<button class="button button-icon {{icon}}" ng-click="openActivityForm()"></button>',
        controller: 'FormCtrl'

    }
});

WhatNowApp.controller('FormCtrl', function($scope, $ionicModal, $stateParams, activityFactory, firebaseService){
    console.log($scope.icon);
    $scope.openActivityForm = function(){

        $scope.forUsers = [];
        //are we creating or editing an activity?
        if($stateParams.activityId){ //can only edit in single activity url
            $scope.editMode = true;
            var id = $stateParams.activityId;
            $scope.activity = firebaseService.activities[id];
            angular.forEach($scope.activity.users, function(user){
                $scope.forUsers[user] = true;
            });
        }else { //add new activity
            $scope.editMode = false;
            $scope.activity = activityFactory.newActivity();
        }

        $scope.formModal.show();

        $scope.addEditActivity = function () {
            var activity = (activityFactory.prep($scope.activity));
            if(!$scope.editMode) { //add new activity
                firebaseService.add(activity);
            }else { //edit one based on url
                firebaseService.activities[id] = $scope.activity;
//                firebaseService.add(activity); //TEMP for rebuilding database
                firebaseService.activities.$save(id);
            }
            $scope.formModal.hide();
        };

        $scope.toggleUser = function(user){
            $scope.activity.users = activityFactory.toggleInArray($scope.forUsers, user);
        };
    };

    $scope.users = firebaseService.users;

    $ionicModal.fromTemplateUrl('templates/form-activity.html', function(modal){
        $scope.formModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });
});










