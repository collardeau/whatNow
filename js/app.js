/**
 * Created by thomascollardeau on 10/8/14.
 */


var WhatNowApp = angular.module('whatNow', ['ionic', 'whatNow.services', 'whatNowFilters', 'momoApp']);

WhatNowApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('/', {
            url: "/open",
            templateUrl: "templates/activities.html",
            controller: 'ActivitiesCtrl'
        })

        .state('completed', {
            url: "/done",
            templateUrl: "templates/activities-completed.html",
            controller: 'ActivitiesCtrl'
        })

        .state('activity', {
            url: "/activity/:activityId",
            templateUrl: "templates/activity.html",
            controller: 'ActivityCtrl'
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/open');
})

.controller('WhatNowCtrl', function($scope, firebaseService, activityFactory, $ionicModal, $state, $stateParams){
    $scope.activities = firebaseService.activities;
    $scope.users = firebaseService.users;

    //Add or Edit an Activity Modal, refactor into a service?
    $ionicModal.fromTemplateUrl('templates/form-activity.html', function(modal){
        $scope.formModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });

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

    $scope.goToActivity = function(activityId){
        $state.go("activity", {activityId: activityId});
    }

    $scope.goToCompleted = function(){
        $state.go("completed");
    }

    $scope.goHome = function(){
        $state.go("/");
    }

});

console.log("ran the app");

