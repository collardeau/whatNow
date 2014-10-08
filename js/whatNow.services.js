/**
 * Created by thomascollardeau on 10/8/14.
 */

angular.module('whatNow.services', ['firebase'])

.factory("firebaseService", function($firebase){
        var url = 'https://what-now.firebaseio.com';
        var fireRef = new Firebase(url);

        var factory = {};
        factory.activities = $firebase(fireRef.child('activities'));

        factory.add = function(newActivity){
            factory.activities.$add(newActivity);
        };

        return factory;

    })
.factory("offlineService", function() {

        var factory = {};
        factory.activities = {
            afasf: {
                title: "do Something",
                urgency: 2,
                duration: 90
            },
            adsga: {
                title: "do Something else",
                urgency: 1,
                duration: 20
            }
        };
        return factory;

});

