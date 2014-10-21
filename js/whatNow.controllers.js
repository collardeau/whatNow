/**
 * Created by thomascollardeau on 10/17/14.
 */



angular.module('whatNow.controllers', ['firebase'])

.controller('WhatNowCtrl', function($scope, firebaseService, activityFactory, $ionicModal, $stateParams) {

    $scope.activities = firebaseService.activities;

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
            var activity = (prepActivity($scope.activity));
            if(!$scope.editMode) { //add new activity
                firebaseService.add(activity);
            }else { //edit one based on url
                firebaseService.activities[id] = $scope.activity;
//                firebaseService.add(activity); //TEMP for rebuilding database
                firebaseService.activities.$save(id);
            }
            $scope.formModal.hide();
        };

        var prepActivity = function(activity) {
            activity.title = activity.title.trim();
            activity.duration = parseInt(activity.duration);
            if (!activity.date) {
                activity.date = Firebase.ServerValue.TIMESTAMP;
            }
            //cleansing old activities
//            delete activity.urgency;
//            delete activity.completed;
//            delete activity.completedBy;
//            delete activity.forUsers;
            return activity;
        }
    };

    //dealing with users and points
    $scope.users = firebaseService.users;

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
    $scope.status = "completed";
//    $scope.status = activityFactory.getStatus($scope.activity);


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
                    $scope.activity.completion.on = Firebase.ServerValue.TIMESTAMP;
                    $scope.saveActivity();
                } else {
                    $scope.activity.completion = null;
                }
            });
        }else {//reopening a done activity
            var confirmPopup = $ionicPopup.confirm({
                title: 'Completion',
                template: 'Are you sure-open this activity?',
                scope: $scope
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.activity.completion = null;
                    $scope.saveActivity();
                } else {
//                    console.log('Cancel Delete');
                }
            });
        }
    };





//    var currentDoer = $scope.activity.completion.by;

    $scope.saveDoer = function () {

        if (!$scope.activity.context.fun) { //don't count points if it's a fun activity

            //remove points if the select option was already set
            if (currentDoer === "evi" || currentDoer === "toma") { //if the doer was one of the 2 users
                $scope.users[currentDoer].points -= $scope.activity.completed.points;
            } else if (currentDoer === "all") { //if both were previously credited, remove from both
                $scope.users.evi.points -= $scope.activity.completed.points;
                $scope.users.toma.points -= $scope.activity.completed.points;
            }

            //add points
            var doer = $scope.activity.completed.by;
            var points = 0;

            var basePoints = 2;
            if(isSelfish()) { basePoints = 1; }
            else if(isSelfless()){ basePoints = 3;}

            var difficultyPoints = 0 //based on time required
            if ($scope.activity.duration && angular.isNumber($scope.activity.duration)) {
                difficultyPoints = Math.floor($scope.activity.duration / 10);
            }

            points = basePoints + difficultyPoints;
            //add the points
            if (doer === "evi" || doer === "toma") { //to either evi or toma if they are the doers
                $scope.users[doer].points += points;
            } else if (doer === "all") {
                $scope.users.evi.points += points;
                $scope.users.toma.points += points;
            }

            currentDoer = $scope.activity.completed.by;
            firebaseService.users.$save();
        }

        //store the points awarded for reference and in case of deleting
        if ($scope.activity.completed.by === "") {
            $scope.activity.completed.points = 0;
        } else {
            $scope.activity.completed.points = points;
        }
        $scope.saveActivity();

    }

    var isSelfish = function () { //is the activity only for and done by self
        var forUsers = $scope.activity.forUsers;
        var doer = $scope.activity.completed.by; //this is a string at this point

        //count element in object, bit primitive?
        var numFor = function() {
            var counter = 0;
            angular.forEach(forUsers, function(){
                counter++;
            });
            return counter;
        };

        if (forUsers[doer] && numFor() === 1){ //user who acted is recipient, of which there is only 1
            console.log("This is a selfish act");
            return true;
        }
        return false;
    };

    var isSelfless = function() {
        var forUsers = $scope.activity.forUsers;
        var doer = $scope.activity.completed.by; //this is a string at this point
        //if doer is not listed in list
        if(doer && !forUsers[doer] && doer !== "all"){
            console.log("This is a selfless act");
            return true;
        }
        return false;
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

.controller("userCtrl", function($scope) {
    $scope.userFilter = [];

    $scope.toggleUser = function(user){
        var toggle = $scope.userFilter.indexOf(user);
        if(toggle > -1) {
            $scope.userFilter.splice(toggle, 1);
        }else{
            $scope.userFilter.push(user);
        }
    };
})

;

console.log("end of whatNow.controllers.js");