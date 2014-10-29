/**
 * Created by thomascollardeau on 10/29/14.
 */

WhatNowApp.controller('ActivitiesCtrl', function($scope, firebaseService, activityFactory, $ionicModal, $stateParams) {

    $scope.actieOrdering = ['-urgent', '-important', 'duration'];
    $scope.userTags = [];
    $scope.contextTag = undefined;

    //Add or Edit an Activity Modal
    $ionicModal.fromTemplateUrl('templates/activity-form.html', function(modal){
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
});