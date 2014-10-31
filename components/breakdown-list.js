/**
 * Created by thomascollardeau on 10/30/14.
 */

WhatNowApp.directive('breakdownList', function(){
    return {
        restrict: 'E',
        scope: {
            list: '='
        },
        templateUrl: 'templates/breakdown-list.html',
        controller: 'BreakDownCtrl'
    }
})

.controller('BreakDownCtrl', function($scope){

    $scope.editMode = false;

    $scope.edit = function(){
      $scope.editMode = true;
    },

    $scope.addListItem = function(newItem){
       if(angular.isString('newItem') && newItem) {
           $scope.list.push($scope.newListItem);
           $scope.newListItem = undefined;
       }
   };

   $scope.editListItem = function(itemId, item){
       console.log("trying to edit my list item");
       $scope.list[itemId] = item;
       $scope.editMode = false;
   }

    $scope.deleteListItem = function(itemId){
        $scope.list.splice(itemId, 1);
    };

});