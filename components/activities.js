/**
 * Created by thomascollardeau on 10/29/14.
 */

WhatNowApp.controller('ActivitiesCtrl', function($scope, firebaseService, activityFactory, $ionicModal, $state, $stateParams) {

    $scope.actieOrdering = ['-urgent', '-important', 'duration'];
    $scope.userTags = [];
    $scope.contextTag = undefined;

});