
WhatNowApp.directive('tabBar', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
          tagged: '='
        },
        templateUrl: 'templates/tab-bar.html',
        controller: "TabCtrl"
    };
})

.controller("TabCtrl", function($scope, tagFactory){

    $scope.contexts = tagFactory.contexts;

    $scope.pickContext = function(context){
        if($scope.tagged === context) { //toggle off
            $scope.tagged = undefined;
        }else{
            $scope.tagged = context;
        }
    };

});