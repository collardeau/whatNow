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

           var item = {
               title: newItem,
               completed: false
           }
           $scope.list.push(item);
           $scope.newListItem = undefined;
       }
   };

   $scope.editListItem = function(itemId, item){
       $scope.list[itemId] = item;
       $scope.editMode = false;
   }

    $scope.deleteListItem = function(itemId){
        $scope.list.splice(itemId, 1);
    };

});