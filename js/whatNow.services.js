/**
 * Created by thomascollardeau on 10/8/14.
 */

angular.module('whatNow.services', [])

.factory("activityService", function() {

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

        factory.test = [1,2,3,4];


        return factory;

});

