/**
 * Created by thomascollardeau on 10/8/14.
 */


//figure out points system
// work out filters:
    //multiple users, only show what they have in common
    //on the done activities, also in common when multiple (not each unique)
    //personal activities vs. shared
//change time range input
//add a search field

var WhatNowApp = angular.module('whatNow', ['ionic', 'whatNow.controllers', 'whatNow.services', 'myFilters']);

WhatNowApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('/', {
            url: "/",
            templateUrl: "templates/activities.html"
        })

        .state('activity', {
            url: "/activity/:activityId",
            templateUrl: "templates/activity.html",
            controller: 'ActivityCtrl'
        })

        .state('done', {
            url: "/done",
            templateUrl: "templates/done.html"
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
})

.directive('tabBar', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/tab-bar.html',
            controller: "TabCtrl"
        };
    })

.directive('userBar', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/user-bar.html',
        scope: true,
        controller: "userCtrl",
        link: function (scope, element, attrs) {
            element.on('click', function(){
                alert(scope.selected);
            })
        }
    };
})

.controller("userCtrl", function($scope, $ionicPopup) {
    $scope.selected = [];

    $scope.toggleSelected = function(selection){
        var pos = $scope.selected.indexOf(selection);
        if(pos > -1) { //selection exists in the array
            $scope.selected.splice(pos, 1);
        }else{
            $scope.selected.push(selection);
        }
    };

    $scope.momo = 0;

    $scope.showMomo = function(){
        var random = Math.floor((Math.random() * 15) + 1);
        var myPopup = $ionicPopup.confirm({
            template: '<img src="img/momo-' + random + '.jpg" width="100%" height="auto"/>',
            title: 'The Great Momo',
            subTitle: 'Master of Stinky Saliva',
            scope: $scope,
            buttons: [
                { text: 'I love Momo!' }
            ]
        });
        myPopup.then(function (res) {
            if (!res) {
                $scope.momo += 1;
            } else {
                console.log("give Momo no point");
            }
        });
    };
})

;

