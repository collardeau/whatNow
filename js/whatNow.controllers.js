/**
 * Created by thomascollardeau on 10/17/14.
 */



angular.module('whatNow.controllers', ['firebase'])

    .controller('WhatNowCtrl', function($scope, firebaseService, $ionicModal) {

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
        $scope.newActivity.urgency = 1;
        $scope.newActivity.duration = 0;
    };

    $scope.closeNewActivity = function(){
        //reset new activity
        $scope.newActivity.title = "";
        $scope.newActivity.urgency = 1;
        $scope.newActivity.duration = 0;
        $scope.newActivity.home = false;
        $scope.newActivity.errand = false;
        $scope.newActivity.computer = false;
        $scope.newActivity.fun = false;
        $scope.newActivity.evi = false;
        $scope.newActivity.toma = false;
        $scope.newActivity.instructions = "";

        $scope.activityModal.hide();

    };

    $scope.addActivity = function () {
        var title = $scope.newActivity.title.trim(),
            urgency = parseInt($scope.newActivity.urgency),
            duration = parseInt($scope.newActivity.duration),
            instructions = $scope.newActivity.instructions;

        var completed = {};
        completed.done = false;
        completed.by = "";
        completed.points = 0;

        var context = {};
        context.home = $scope.newActivity.home;
        context.errand = $scope.newActivity.errand;
        context.computer = $scope.newActivity.computer;
        context.fun = $scope.newActivity.fun;

        var forUsers = {};
        forUsers.evi =  $scope.newActivity.evi,
            forUsers.toma = $scope.newActivity.toma,


            firebaseService.add({
                title : title,
                urgency: urgency,
                duration: duration,
                context: context,
                forUsers: forUsers,
                completed: completed,
                instructions: instructions,
                date: Firebase.ServerValue.TIMESTAMP
            });

        $scope.closeNewActivity();

    };

    $scope.homeFilter = false;
    $scope.errandFilter = false;
    $scope.computerFilter = false;
    $scope.funFilter = false;

    $scope.eviFilter = false;
    $scope.tomaFilter = false;

    $scope.hide = function(activity){

        if (activity.completed.done){
            return true;
        }
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
        if (contextList[context]) {
            return true;
        }
        return false;
    };

    var hasUser = function(userList, user){
        if (userList[user]) {
            return true;
        }
        return false;
    };

    //dealing with users and points, diff controller or custom directive?
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


    .controller("SingleActivityCtrl", function($scope, firebaseService, $state, $stateParams, $ionicModal, $ionicPopup) {

    var id = $stateParams.activityId;
    $scope.activity = firebaseService.activities[id];

    $scope.saveActivity = function () {
        $scope.activity.urgency = parseInt($scope.activity.urgency);
        $scope.activity.duration = parseInt($scope.activity.duration);
//            need this first line or else activity is only saved once in db
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
    }

    $ionicModal.fromTemplateUrl('edit-activity.html', function (modal) {
            $scope.editActivityModal = modal;
        },
        {
            scope: $scope,
            animation: 'slide-in-up'

        });

    $scope.editActivity = function () {
        $scope.editActivityModal.show();
    };

    $scope.closeEditActivity = function () {
        $scope.editActivityModal.hide();
    };

    //dealing with users points
    $scope.users = firebaseService.users;

    $scope.saveCompleted = function () {


        if (!$scope.activity.completed.done) {
            $scope.activity.completed.by = "";
            $scope.activity.completed.on = undefined;
            $scope.saveDoer(); //reset the points
        } else {
            $scope.activity.completed.on = Firebase.ServerValue.TIMESTAMP;
        }
        $scope.saveActivity();

    }

    var currentDoer = $scope.activity.completed.by;

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

    isSelfish();
    isSelfless();

});


console.log("end of whatNow.controllers.js");