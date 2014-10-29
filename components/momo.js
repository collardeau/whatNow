/**
 * Created by thomascollardeau on 10/29/14.
 */
//var momoApp = angular.module('momoApp', ['$ionic']);
angular.module('momoApp', ['ionic', 'firebase'])

.factory('momoFactory', function($firebase) {
        var url = 'https://what-now.firebaseio.com';
        var fireRef = new Firebase(url);

        return {
            momo: $firebase(fireRef.child('momo'))
        }

})

.directive('momo', function(){
    return {
        restrict: 'E',
        replace: true,
        controller: 'momoCtrl',
        template: '<a class="tab-item has-badge" ng-click="showMomo()"><span class="badge badge-energized">{{momo.points}}</span><i class="icon ion-ios7-paw"></i> Momo</a>'
    }
})

.controller('momoCtrl', function($scope, momoFactory, $ionicPopup){

    $scope.momo = momoFactory.momo;

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
                $scope.momo.points += 1;
                momoFactory.momo.$save('points');
            } else {
//                console.log("give Momo no point");
            }
        });
    };
})


;