/**
 * Created by thomascollardeau on 10/8/14.
 */


var WhatNowApp = angular.module('whatNow', ['ionic', 'whatNow.services', 'whatNowFilters', 'momoApp']);

WhatNowApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('/', {
            url: "/open",
            templateUrl: "templates/activities.html"
        })

        .state('completed', {
            url: "/done",
            templateUrl: "templates/activities-completed.html"
        })

        .state('activity', {
            url: "/activity/:activityId",
            templateUrl: "templates/activity.html",
            controller: 'ActivityCtrl'
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/open');
})

.controller('WhatNowCtrl', function($scope, firebaseService, activityFactory, $ionicModal, $state){
    $scope.activities = firebaseService.activities;
    $scope.users = firebaseService.users;

    $scope.actieOrdering = ['-urgent', '-important', 'duration'];
    $scope.userTags = [];
    $scope.contextTag = undefined;

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

