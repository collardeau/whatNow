/**
 * Created by thomascollardeau on 10/8/14.
 */

var WhatNowApp = angular.module('whatNow', ['ionic', 'whatNow.services']);

WhatNowApp.controller('WhatNowCtrl', function($scope, activityService) {

    $scope.activites = activityService.activities;


});