/**
 * Created by thomascollardeau on 10/8/14.
 */

var WhatNowApp = angular.module('whatNow', ['ionic', 'whatNow.services']);

WhatNowApp.controller('WhatNowCtrl', function($scope, offlineService, firebaseService, $ionicModal) {

    $scope.activities = firebaseService.activities;
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
            duration = $scope.newActivity.duration,
            context = [],
            home = $scope.newActivity.home,
            errand = $scope.newActivity.errand,
            computer = $scope.newActivity.computer,
            fun = $scope.newActivity.fun,
            forUsers = [],
            evi = $scope.newActivity.evi,
            toma = $scope.newActivity.toma,
            instructions = $scope.newActivity.instructions;

            if (home){ context.push("home"); }
            if (errand){ context.push("errand"); }
            if (fun){ context.push("fun"); }
            if (computer){ context.push("computer"); }

            if (evi){ forUsers.push("evi"); }
            if (toma){ forUsers.push("toma"); }

        firebaseService.add({
            title : title,
            urgency: urgency,
            duration: duration,
            context: context,
            forUsers: forUsers,
            instructions: instructions,
            date: Firebase.ServerValue.TIMESTAMP
       });

        $scope.activityModal.hide();

   };

    $scope.homeFilter = false;
    $scope.errandFilter = false;
    $scope.computerFilter = false;
    $scope.funFilter = false;

    $scope.eviFilter = false;
    $scope.tomaFilter = false;

    $scope.hide = function(activity){
        if($scope.homeFilter && !hasContext(activity.context, "home")){
            return true;
        }
        if($scope.errandFilter && !hasContext(activity.context, "errand")){
            return true;
        }
        if($scope.computerFilter && !hasContext(activity.context, "computer")){
            return true;
        }
        if($scope.funFilter && !hasContext(activity.context, "fun")){
            return true;
        }
        if($scope.eviFilter && !hasUser(activity.forUsers, "evi")){
            return true;
        }
        if($scope.tomaFilter && !hasUser(activity.forUsers, "toma")){
            return true;
        }

    };

    var hasContext = function(contextList, context){
        if(contextList) {
            for (var i = 0; i < contextList.length; i++) {
                if (contextList[i] === context) {
                    return true;
                }
            }
        }
        return false;
    };

    var hasUser = function(userList, user){
        if(userList) {
            for (var i = 0; i < userList.length; i++) {
                if (userList[i] === user) {
                    return true;
                }
            }
        }
        return false;
    };
});

