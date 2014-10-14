/**
 * Created by thomascollardeau on 10/8/14.
 */

//add completed and completedBy when adding to firebase db
//make sure to enter integers and bool in the database where appropriate
//add required fields (ng-pristine etc)
//sort by duration (not necessarily urgency) -- not working?
//with a time range?
//bad filtering when no duration input
//figure out points system
//add a search field

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
        })

        .state('done', {
            url: "/done",
            templateUrl: "templates/done.html",
            controller: 'WhatNowCtrl'
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});

WhatNowApp.controller('WhatNowCtrl', function($scope, firebaseService, $ionicModal) {

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
        $scope.newActivity.duration = 0;
    };

    $scope.closeNewActivity = function(){
        //reset new activity
        $scope.newActivity.title = "";
        $scope.newActivity.urgency = 2;
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
            completed = false,
            completedBy = "",
            urgency = parseInt($scope.newActivity.urgency),
            duration = parseInt($scope.newActivity.duration),
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
            completed: completed,
            completedBy: completedBy,
            urgency: urgency,
            duration: duration,
            context: context,
            forUsers: forUsers,
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

//    $scope.duration = '-duration';
    $scope.switchSorting = function(){
        alert('soon');
    }

    $scope.hide = function(activity){

        if (activity.completed){
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

});

WhatNowApp.controller("SingleActivityCtrl", function($scope, firebaseService, $state, $stateParams, $ionicModal, $ionicPopup){

        var id = $stateParams.activityId;
        $scope.activity = firebaseService.activities[id];

        var saveActivity = function(){
//            need this first line or else activity is only saved once in db
            firebaseService.activities[id] = $scope.activity;
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

    //dealing with users points
    $scope.users = firebaseService.users;

    var currentDoer = $scope.activity.completedBy;

    $scope.saveCompleted = function(){;
        if(!$scope.activity.completed){
           $scope.activity.completedBy = "";
            $scope.saveDoer();
        }
        saveActivity()

    }
    $scope.saveDoer = function(){
        var points = $scope.activity.urgency;
        var doer = $scope.activity.completedBy;
        //remove points if doer was previously set to either evi and thomas
        if (currentDoer === "evi" || currentDoer === "toma"){
            //check if the task is only for someone else, if so double the points
            $scope.users[currentDoer].points -= points;
//            firebaseService.users.$save(currentDoer);
        }else if (currentDoer === "all"){ //if both were previously credited, remove from both
            $scope.users.evi.points -= points;
            $scope.users.toma.points -= points;
        }
        //if the doer is either evi or toma, add the points
        if (doer === "evi" || doer === "toma") {
            var currentPoints = $scope.users[doer].points;
            $scope.users[doer].points = currentPoints + points;
//            firebaseService.users.$save(doer);
        }else if (doer === "all"){
            $scope.users.evi.points += points;
            $scope.users.toma.points += points;
        }

        //what if doer was unassigned ""

        currentDoer = $scope.activity.completedBy;
        saveActivity();
        firebaseService.users.$save();

    }

});