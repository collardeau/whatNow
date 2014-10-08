/**
 * Created by thomascollardeau on 10/8/14.
 */

var WhatNowApp = angular.module('whatNow', ['ionic', 'whatNow.services']);

WhatNowApp.controller('WhatNowCtrl', function($scope, activityService, $ionicModal) {

    $scope.activities = activityService.activities;
    $scope.newActivity = {};


   $ionicModal.fromTemplateUrl('new-activity.html', function(modal){
       $scope.activityModal = modal;
       },
       {
           scope: $scope,
           animation: 'slide-in-up'

        });

    $scope.newActivity = function(){
        $scope.activityModal.show();
    };

    $scope.closeNewActivity = function(){
        $scope.activityModal.hide();
    };

   $scope.addActivity = function(){
        var title = $scope.newActivity.title,
            urgency = $scope.newActivity.urgency,
            duration = $scope.newActivity.duration;
       $scope.activities[title] = {
           title : title,
           urgency: urgency,
           duration: duration
       };
       $scope.activityModal.hide();
    };
});

