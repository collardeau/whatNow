/**
 * Created by thomascollardeau on 10/17/14.
 */



angular.module('whatNow.controllers', ['firebase'])

.controller('WhatNowCtrl', function($scope, firebaseService, activityFactory, $ionicModal, $stateParams, $filter) {

    $scope.activities = firebaseService.activities;
    $scope.users = firebaseService.users;

    $scope.activityOrdering = ['-urgent', '-important', 'duration'];
    $scope.filtersSelected = {
        users: [],
        context: undefined
    };

    $scope.activitiesFilterFn = function(item){

        //hide done activities -- they should probably be moved to another table
        if(angular.isObject(item.completion) && item.completion.done) {
            return false;
        }

        var numUsersFiltered = $scope.filtersSelected.users.length;
        var owners = activityFactory.getTrueKeys(item.owners);

        switch(numUsersFiltered) {
            case 0: // if not users are selected, hide personal
                if (angular.isDefined(item.personal) && item.personal) {
                    return false;
                }
                break;
            case 1: //hide if the user is not in filtered array
                var matched = false;
                //make this a filter?
                angular.forEach(owners, function(owner) {
                    if(owner === $scope.filtersSelected.users[0]){ //we know only 1 user
                        matched = true;
                        return;
                    }
                });
                if(!matched){
                    return false;
                }
                break;
            default:  //activities in common
                var owners = $filter('sort')(owners);
                var filteredOwners = $filter('sort')($scope.filtersSelected.users);
                if(!angular.equals(owners, filteredOwners)){
                    return false;
                }
        }

        //deal with the context\
        if($scope.filtersSelected.context) {
            if (!angular.equals($scope.filtersSelected.context, item.context)) {
                return false;
            }
        }
        return true;
    };

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
    $scope.doneFilter = [];

    $scope.isSelfless = function(activity){
        return activityFactory.isSelfless(activity);
    }

    $scope.toggleDoneFilter = function(user){
        console.log("booy");
        var toggle = $scope.doneFilter.indexOf(user);
        if(toggle > -1) {
            $scope.doneFilter.splice(toggle, 1);
        }else{
            $scope.doneFilter.push(user);
        }
        console.log($scope.doneFilter);
    };

   //this filter function is almost like the open activity one!
    $scope.doneFilterFn = function(item){
        //hide open activities -- they should probably be moved to another table
        if(!angular.isObject(item.completion) ||  !item.completion.done) {
            return false;
        }

        var numUsersFiltered = $scope.doneFilter.length;
        var doers = activityFactory.getTrueKeys(item.completion.by);


        switch(numUsersFiltered) {
            case 0: // if not users are selected, hide personal
                if (angular.isDefined(item.personal) && item.personal) {
                    return false;
                }
                break;
            case 1: //hide if the user is not in filtered array
                var matched = false;
                //make this a filter?
                angular.forEach(doers, function(doer) {
                    if(doer === $scope.doneFilter[0]){ //we know only 1 user
                        matched = true;
                        return;
                    }
                });
                if(!matched){
                    return false;
                }
                break;
            default:  //activities in common
                var doers = $filter('sort')(doers);
                var filteredUsers = $filter('sort')($scope.doneFilter);
                if(!angular.equals(doers, filteredUsers)){
                    return false;
                }
        }
        return true;
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

        if(activityFactory.isFun($scope.activity) || $scope.activity.personal){
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

    $scope.pickContext = function(context){
        if($scope.filtersSelected.context === context) { //toggle off
            $scope.filtersSelected.context = undefined;
        }else{
            $scope.filtersSelected.context = context;
        }
    };

});

console.log("end of whatNow.controllers.js");