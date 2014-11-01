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

    $scope.editable = [];

    $scope.edit = function(index){
      $scope.editable[index] = true;
    };

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

   $scope.saveListItem = function(index, item){
       $scope.list[index] = item;
       $scope.editable[index] = false;
   }

    $scope.deleteListItem = function(index){
        $scope.list.splice(index, 1);
    };

})

.directive('focusMe', function($timeout) {
    return {
        link: function(scope, element, attrs) {
            scope.$watch(attrs.focusMe, function(value) {
                if(value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
    };
});


;