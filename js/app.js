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

var WhatNowApp = angular.module('whatNow', ['ionic', 'whatNow.controllers', 'whatNow.services', 'whatNowFilters']);

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

;

