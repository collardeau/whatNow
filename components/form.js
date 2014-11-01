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

    $scope.openActivityForm = function(){

        $scope.users = firebaseService.users;
        $scope.editMode = inEditMode();

        $scope.forUsers = {}; //take from checkbox as true and pass into array

        //get the proper activity start values to fill the form
        if(!$scope.editMode){ //brand new form
            $scope.activity = activityFactory.newActivity;
        }else { //editing an existing activity
            var id = $stateParams.activityId;
            $scope.activity = firebaseService.activities[id];
            angular.forEach($scope.activity.users, function(user){
                $scope.forUsers[user] = true; //fill in the proper checkmarks for activity benefactors
            });
        }

        $scope.formModal.show();

    };

    $scope.addEditActivity = function () {
        var activity = (activityFactory.prep($scope.activity));
        if(!$scope.editMode) { //add new activity
            firebaseService.add(activity);
        }else { //edit one based on url
            var id = $scope.activity.$id;
            firebaseService.activities[id] = $scope.activity;
            firebaseService.activities.$save(id);
        }
        $scope.formModal.hide();
    };

    $scope.toggleUser = function(user){
        activityFactory.toggleInArray($scope.activity.users, user);
    };

    var inEditMode = function(){
        //if a specific id in the url, we are in edit mode
        if($stateParams.activityId){
            return true;
        }
        return false;
    };



    $ionicModal.fromTemplateUrl('templates/form-activity.html', function(modal){
        $scope.formModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });
});










