/**
 * Created by thomascollardeau on 10/8/14.
 */

var WhatNowApp = angular.module('whatNow', ['ionic', 'whatNow.services']);

WhatNowApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('/', {
            url: "/",
            templateUrl: "templates/activities.html",
            controller: "WhatNowCtrl"
        })

        .state('activity', {
            url: "/activity/:activityId",
            templateUrl: "templates/activity.html",
            controller: 'SingleActivityCtrl'
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});

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
            context = {};
            context.home = $scope.newActivity.home,
            context.errand = $scope.newActivity.errand,
            context.computer = $scope.newActivity.computer,
            context.fun = $scope.newActivity.fun,
            forUsers = {},
            forUsers.evi =  $scope.newActivity.evi,
            forUsers.toma = $scope.newActivity.toma,
            instructions = $scope.newActivity.instructions;

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

WhatNowApp.controller("SingleActivityCtrl", function($scope, $state, $stateParams, $ionicModal, $ionicPopup, firebaseService){
        var id = $stateParams.activityId;
        $scope.activity = firebaseService.activities[id];
//        console.log($scope.activity);

        $scope.saveActivity = function(){
            firebaseService.activities.$save(id);
        };

        $scope.deleteActivity = function(){
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Delete',
                    template: 'Are you sure you want to delete this activity?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        firebaseService.activities.$remove(id);
                        $state.go('/');
                    } else {
                        console.log('Cancel Delete');
                    }
                });
        }

        $ionicModal.fromTemplateUrl('edit-activity.html', function(modal){
            $scope.editActivityModal = modal;
        },
        {
            scope: $scope,
            animation: 'slide-in-up'

        });

    $scope.editActivity = function(){
        $scope.editActivityModal.show();
    };

    $scope.closeEditActivity = function(){
        $scope.editActivityModal.hide();
    };

});