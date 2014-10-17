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

//        factory.save = function(id){
//            factory.activities.$save(id);
//        }

        factory.users = $firebase(fireRef.child('users'));

        return factory;

    });

