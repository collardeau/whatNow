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

    })

.factory('activityFactory', function() {
    return {
        test: "I am an activity",

       newActivity: function(){
            return {
                title: undefined,
                urgent: false,
                important: false,
                duration: 5,
                completion: {
                    done: false,
                    by: undefined,
                    ptsGiven: 0
                },
                context: undefined,
                owners: {
                    evi: false,
                    toma: false
                },
                instructions: undefined
            };
        }
    }
})
;

