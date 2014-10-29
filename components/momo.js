/**
 * Created by thomascollardeau on 10/29/14.
 */
//var momoApp = angular.module('momoApp', ['$ionic']);
angular.module('momoApp', ['ionic'])
.directive('momo', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/momo.html',
        controller: 'momoCtrl'
    }
})

.controller('momoCtrl', function($scope, $ionicPopup){
    $scope.momo = 0;

    $scope.showMomo = function(){
        var random = Math.floor((Math.random() * 15) + 1);
        var myPopup = $ionicPopup.confirm({
            template: '<img src="img/momo-' + random + '.jpg" width="100%" height="auto"/>',
            title: 'The Great Momo',
            subTitle: 'Master of Stinky Saliva',
            scope: $scope,
            buttons: [
                { text: 'I love Momo!' }
            ]
        });
        myPopup.then(function (res) {
            if (!res) {
                $scope.momo += 1;
            } else {
                console.log("give Momo no point");
            }
        });
    };
});