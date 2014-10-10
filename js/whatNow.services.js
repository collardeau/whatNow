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
                    "completed" : false,
                    "completedBy" : "",
                    "context" : {
                        "computer" : false,
                        "errand" : true,
                        "fun" : false,
                        "home" : false
                    },
                    "date" : 1412812082139,
                    "duration" : 20,
                    "evi" : true,
                    "forUsers" : {
                        "evi" : true,
                        "toma" : true
                    },
                    "instructions" : "Either at Flora or Smíchov",
                    "title" : "Take clothes to Dry Cleaners",
                    "urgency" : 3
                },
                "-JYm9cHBMn1OgqdRycJx" : {
                    "completed" : false,
                    "completedBy" : "evi",
                    "context" : {
                        "computer" : true,
                        "errand" : false,
                        "fun" : false,
                        "home" : true
                    },
                    "date" : 1412812146049,
                    "duration" : 15,
                    "forUsers" : {
                        "evi" : false,
                        "toma" : true
                    },
                    "instructions" : "Acoustic rock and rhythm",
                    "title" : "Find guitar lessons in Prague",
                    "urgency" : 2
                },
                "-JYm9jQAysKXGT_YouY_" : {
                    "completed" : false,
                    "completedBy" : "none",
                    "context" : {
                        "computer" : false,
                        "errand" : false,
                        "fun" : false,
                        "home" : true
                    },
                    "date" : 1412812175309,
                    "forUsers" : {
                        "evi" : true,
                        "toma" : false
                    },
                    "instructions" : "Kindle is in living room",
                    "title" : "Fix Kindle",
                    "urgency" : 2
                },
                "-JYmAXzl6S7UCe-pEv6e" : {
                    "completed" : false,
                    "completedBy" : "",
                    "context" : {
                        "computer" : true,
                        "errand" : false,
                        "fun" : true,
                        "home" : false
                    },
                    "date" : 1412812386497,
                    "duration" : 120,
                    "evi" : true,
                    "forUsers" : {
                        "evi" : false,
                        "toma" : true
                    },
                    "instructions" : "never been!",
                    "title" : "visit Prague Castle",
                    "urgency" : 2
                },
                "-JYqMfsRBhgjnn4hVDa8" : {
                    "completed" : false,
                    "completedBy" : "",
                    "context" : {
                        "computer" : false,
                        "errand" : false,
                        "fun" : true,
                        "home" : false
                    },
                    "date" : 1412882677467,
                    "forUsers" : {
                        "evi" : false,
                        "toma" : true
                    },
                    "title" : "visit prague cemetary",
                    "urgency" : 1
                }
            }
        };
        return factory;

});

