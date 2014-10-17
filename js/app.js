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

var WhatNowApp = angular.module('whatNow', ['ionic', 'whatNow.controllers', 'whatNow.services']);

WhatNowApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('/', {
            url: "/",
            templateUrl: "templates/activities.html"
        })

        .state('activity', {
            url: "/activity/:activityId",
            templateUrl: "templates/activity.html",
            controller: 'activityCtrl'
        })

        .state('done', {
            url: "/done",
            templateUrl: "templates/done.html",
            controller: 'WhatNowCtrl'
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
})

//.directive('newActivityPanel', function() {
//        return {
//            restrict: 'E',
//            templateUrl: 'templates/new-activity.html'
//        };
//    })
//

;