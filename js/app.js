/**
 * Created by thomascollardeau on 10/8/14.
 */

var WhatNowApp = angular.module('whatNow', ['ionic', 'whatNow.services']);

WhatNowApp.controller('WhatNowCtrl', function($scope, offlineService, firebaseService, $ionicModal) {

    $scope.activities = offlineService.activities;
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
        $scope.newActivity.urgency = 2;
    };

    $scope.closeNewActivity = function(){
        $scope.activityModal.hide();
    };

    $scope.addActivity = function () {
        var title = $scope.newActivity.title,
            urgency = $scope.newActivity.urgency,
            duration = $scope.newActivity.duration;

        firebaseService.add({
            title : title,
            urgency: urgency,
            duration: duration,
            date: Firebase.ServerValue.TIMESTAMP
       });

   };
});
