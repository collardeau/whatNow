
WhatNowApp.directive('userBar', function() {
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

    .controller("userBarCtrl", function($scope) {  // , $ionicPopup
        $scope.users = $scope.users(); //getter

        $scope.toggleUserTag = function(tag){
            var pos = $scope.tagged.indexOf(tag);
            if(pos > -1) { //selection exists in the array
                $scope.tagged.splice(pos, 1);
            }else{
                $scope.tagged.push(tag);
            }
        };
//
//    $scope.momo = 0;
//
//    $scope.showMomo = function(){
//        var random = Math.floor((Math.random() * 15) + 1);
//        var myPopup = $ionicPopup.confirm({
//            template: '<img src="img/momo-' + random + '.jpg" width="100%" height="auto"/>',
//            title: 'The Great Momo',
//            subTitle: 'Master of Stinky Saliva',
//            scope: $scope,
//            buttons: [
//                { text: 'I love Momo!' }
//            ]
//        });
//        myPopup.then(function (res) {
//            if (!res) {
//                $scope.momo += 1;
//            } else {
//                console.log("give Momo no point");
//            }
//        });
//    };
//
//
    });