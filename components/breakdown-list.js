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
   $scope.addListItem = function(newItem){
       if(newItem) {
           $scope.list.push($scope.newListItem);
           $scope.newListItem = undefined;
       }
   };

    $scope.deleteListItem = function(item){
        toggleInArray($scope.list, item);
    };

     var toggleInArray = function(array, string){
        var pos = array.indexOf(string);
        if(pos > -1) { //selection exists in the array
            array.splice(pos, 1);
        }else{
            array.push(string);
        }
        return array;
    };



});