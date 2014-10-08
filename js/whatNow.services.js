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
        factory = {
            "activities" : {
                "-JYm9Ng1wyCD2KqSReRK" : {
                    "context" : [ "errand" ],
                    "date" : 1412812082139,
                    "duration" : 20,
                    "forUsers" : [ "evi", "toma" ],
                    "instructions" : "Either at Flora or Smíchov",
                    "title" : "Take clothes to Dry Cleaners",
                    "urgency" : 2
                },
                "-JYm9cHBMn1OgqdRycJx" : {
                    "context" : [ "home", "computer" ],
                    "date" : 1412812146049,
                    "duration" : 15,
                    "forUsers" : [ "toma" ],
                    "instructions" : "Acoustic rock and rhythm",
                    "title" : "Find guitar lessons in Prague",
                    "urgency" : 2
                },
                "-JYm9jQAysKXGT_YouY_" : {
                    "context" : [ "home" ],
                    "date" : 1412812175309,
                    "forUsers" : [ "evi" ],
                    "instructions" : "Kindle is in living room",
                    "title" : "Fix Kindle",
                    "urgency" : 2
                },
                "-JYmAHglICXzRcx85f9s" : {
                    "context" : [ "home", "computer" ],
                    "date" : 1412812319714,
                    "duration" : 10,
                    "forUsers" : [ "toma" ],
                    "instructions" : "current is set to expire!",
                    "title" : "Get new CC",
                    "urgency" : "3"
                },
                "-JYmAXzl6S7UCe-pEv6e" : {
                    "context" : [ "fun" ],
                    "date" : 1412812386497,
                    "duration" : 120,
                    "forUsers" : [ "toma" ],
                    "instructions" : "never been!",
                    "title" : "visit prague Castle",
                    "urgency" : 2
                }
            }
        };
        return factory;

});

