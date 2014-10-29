
WhatNowApp
    .directive('userBar', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/user-bar.html',
            scope: {
                users: '&',
                tagged: '='
            },
            controller: "userBarCtrl"
        };
})

    .controller("userBarCtrl", function($scope, $ionicPopup) {  // , $ionicPopup
        $scope.users = $scope.users(); //getter

        $scope.toggleUserTag = function(tag){
            var pos = $scope.tagged.indexOf(tag);
            if(pos > -1) { //selection exists in the array
                $scope.tagged.splice(pos, 1);
            }else{
                $scope.tagged.push(tag);
            }
        };
    })

;