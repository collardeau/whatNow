/**
 * Created by thomascollardeau on 10/17/14.
 */



angular.module('whatNow.controllers', ['firebase'])

.controller('WhatNowCtrl', function($scope, firebaseService, activityFactory, $ionicModal, $stateParams) {

    $scope.activities = firebaseService.activities;
    $scope.users = firebaseService.users;

    //Add or Edit an Activity Modal
    $ionicModal.fromTemplateUrl('templates/activity-form.html', function(modal){
        $scope.formModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });
    $scope.openActivityForm = function(){

        //are we creating or editing an activity?
        if($stateParams.activityId){ //can only edit in single activity url
            $scope.editMode = true;
            var id = $stateParams.activityId;
            $scope.activity = firebaseService.activities[id];
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
    };

    //dealing with done page, filters to see who did what?
    $scope.eviDoneFilter = false;
    $scope.tomaDonefilter = false;

    $scope.hideDoers = function(activity){

        if(!activity.completed.done){
            return true;
        }

        if(activity.completed.by == "all"){
            return false;
        }
        if($scope.eviDoneFilter && activity.completed.by !== "evi" ){
            return true;
        }

        if($scope.tomaDoneFilter && activity.completed.by !== "toma" ){
            return true;
        }
    };

})

.controller("ActivityCtrl", function($scope, activityFactory, firebaseService, $state, $stateParams, $ionicModal, $ionicPopup) {

    var id = $stateParams.activityId;
    $scope.id = id;
    $scope.activity = firebaseService.activities[id];
//    $scope.activity = activityFactory.newActivity(); //for developing
    $scope.status = activityFactory.getStatus($scope.activity);

    $scope.saveActivity = function () {
        firebaseService.activities[id] = $scope.activity;
        firebaseService.activities.$save(id);
    };

    $scope.deleteActivity = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete',
            template: 'Are you sure you want to delete this activity?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                firebaseService.activities.$remove(id);
                $state.go('/');
            } else {
                console.log('Cancel Delete');
            }
        });
    };

    $scope.toggleCompletion = function() {
        if($scope.activity.completion.done) { //newly done activity
            var confirmPopup = $ionicPopup.confirm({
                title: 'Nice!',
                templateUrl: 'templates/complete-form.html',
                scope: $scope
            });
            confirmPopup.then(function (res) {
                if (res) {
                    assignPoints();
                    $scope.activity.completion.on = Firebase.ServerValue.TIMESTAMP;
                    $scope.status = activityFactory.getStatus($scope.activity);
                    $scope.saveActivity();
//                    $state.go("done");
                } else {
                    $scope.activity.completion = null;
                }
            });
        }else {//reopening a done activity
            var confirmPopup = $ionicPopup.confirm({
                title: 'Completion',
                template: 'Re-open this activity?',
                scope: $scope
            });
            confirmPopup.then(function (res) {
                if (res) {
//                    resetPoints();
                    $scope.activity.completion = null;
                    $scope.saveActivity();
                    $scope.status = activityFactory.getStatus($scope.activity);
                } else {
//                    console.log('Cancel Delete');
                }
            });
        }
    };

    var assignPoints = function(){
        angular.forEach($scope.activity.completion.by, function(user, name){
            if(user){
                var points = determinePoints();
                $scope.activity.completion.ptsGiven = points;
                $scope.users[name].points += points;
                firebaseService.users.$save(); //saving all the users in db
            }
        });
    };

    var determinePoints = function(){ //this should be in in the activity service
        if(activityFactory.isFun($scope.activity)){
            return 0;
        }

        var basePoints = 0;
        var difficultyPoints = 0;
        var extraPoints = 0;

        //intent
        if(activityFactory.isSelfless($scope.activity)){
            basePoints = 3;
        }else if (activityFactory.isSelfish($scope.activity)){
            basePoints = 0;
        }else {
            basePoints = 1;
        }

        //difficulty
        var difficultyPoints = $scope.activity.duration;

        //extra (important + urgency)
        if($scope.activity.important && $scope.activity.urgent){
            extraPoints = 2;
        }else if ($scope.activity.important || $scope.activity.urgent){
            extraPoints = 1;
        }


        var points = basePoints + difficultyPoints + extraPoints;
        return points;
    };

    var resetPoints = function(){
        //when user reopens and activity, subtract the points already assigned
        var points = $scope.activity.completion.ptsGiven;
        angular.forEach($scope.activity.completion.by, function(user, name){
            if(user){
                $scope.users[name].points -= points;
                firebaseService.users.$save();
            }
        });
    };

})

.controller("TabCtrl", function($scope, tagFactory){

    $scope.contexts = tagFactory.contexts;
    $scope.contextFilter;

    $scope.pickContext = function(context){
        if($scope.contextFilter === context) { //toggle off
            $scope.contextFilter = undefined;
        }else{
            $scope.contextFilter = context;
        }
    };

})

.controller("userCtrl", function($scope, $ionicPopup) {
    $scope.userFilter = [];

    $scope.toggleUser = function(user){
        var toggle = $scope.userFilter.indexOf(user);
        if(toggle > -1) {
            $scope.userFilter.splice(toggle, 1);
        }else{
            $scope.userFilter.push(user);
        }
    };

    $scope.showMomo = function(){
        var random = Math.floor((Math.random() * 8) + 1);
        var myPopup = $ionicPopup.show({
            template: '<img src="img/momo-' + random + '.jpg" width="100%" height="auto"/>',
            title: 'The Master of Stinky Saliva',
            subTitle: 'has no points!',
            scope: $scope,
            buttons: [
                { text: 'I love Momo!' }
            ]
        });
        myPopup();
    };
})

;

console.log("end of whatNow.controllers.js");