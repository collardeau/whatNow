WhatNowApp.controller("ActivityCtrl", function($scope, activityFactory, firebaseService, $state, $stateParams, $ionicModal, $ionicPopup) {

    var id; //get the current activity id
    if($stateParams.activityId) { //grab activity from url if there is one
        id = $stateParams.activityId;
        $scope.activity = firebaseService.activities[id];
    }else{ //from ng-repeat directive
        id = $scope.activity.$id;
    }

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
                templateUrl: 'templates/form-complete.html',
                scope: $scope
            });
            confirmPopup.then(function (res) {
                if (res) {
                    assignPoints();
                    $scope.activity.completion.on = Firebase.ServerValue.TIMESTAMP;
                    $scope.activity.status = activityFactory.getStatus($scope.activity);
                    $scope.saveActivity();
//                    $state.go("done");
                } else {
                    $scope.activity.completion = activityFactory.newCompletion();
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
                    resetPoints();
                    $scope.activity.completion = activityFactory.newCompletion();
                    $scope.activity.status = activityFactory.getStatus($scope.activity);
                    $scope.saveActivity();
                } else {
//                    console.log('Cancel Delete');
                }
            });
        }

        var assignPoints = function(){
            angular.forEach($scope.activity.completion.by, function(doer){
                var points = determinePoints();
                $scope.activity.completion.ptsGiven = points;
                $scope.users[doer].points += points;
                firebaseService.users.$save(); //saving all the users in db
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
            angular.forEach($scope.activity.completion.by, function(doer){
                $scope.users[doer].points -= points;
                firebaseService.users.$save();
            });
        };

        $scope.doers = []; //grabbing owners of the task
        $scope.toggleDoer = function(user){
            $scope.activity.completion.by = activityFactory.toggleInArray($scope.doers, user);
        };
    };

    $scope.isSelfless = function(activity){
        return activityFactory.isSelfless(activity);
    }

})

.directive('activityOpenItem', function(){
    return {
        restrict: 'E',
        templateUrl: "templates/activity-open-item.html"
    };
})

.directive('activityCompleteItem', function(){
    return {
        restrict: 'E',
        templateUrl: "templates/activity-complete-item.html",
        controller: "ActivityCtrl" //to check act for selfishness
    };
})

.directive('owners', function(){ //list out the owners
    return {
        restrict: 'E',
        template: '<span ng-repeat="user in activity.users"><b>{{user}}</b><span ng-hide="$last"> & </span></span>'
    }
})

.directive('doers', function(){
    return {
        restrict: 'E',
        template: '<span ng-repeat="user in activity.completion.by"><b>{{user}}</b><span ng-hide="$last"> & </span></span>'
    }
    });