angular.module('whatNowFilters', [])

.filter('acties', function ($filter) {
    return function (activities, tags) {
        var filtered = activities;

        //user tag filtering
        var numUsersSelected = tags.length;
        console.log(tags);
        switch(numUsersSelected) {
            case 0: //hide the personal activities if no users are selected
                filtered = $filter('personal')(filtered);
                break;
//            case 1: //show the person being filtered is an owner of the activity
//                filtered = $filter('stringInObj')(filtered, tags[0], filterGroup);
//                break;
            default:  //show all in common
//                filtered = $filter('arrayMatch')(filtered, tags);
        }
        return filtered;
    };
})


.filter('sort', function() {
    return function(input) {
        return input.sort();
    }
})

.filter('getTrueKeys', function(){
    return function(object){
        var keys = [];
        console.log("getting true keys");
        if(angular.isObject(object)) {
            angular.forEach(object, function (value, key) {
                if(value) {
                    keys.push(key);
                }
            });
        }
        return keys;
    }
})

.filter('arrayMatch', function($filter){
    return function(activities, filters){
        var filtered = [];
        var sortedFilters = $filter('sort')(filters);
        console.log("the sorted filters: " + sortedFilters);
        angular.forEach(activities, function(activity){
            console.log(activity.owners);
            var owners = $filter('getTrueKeys')(activity.owners);
            var sortedOwners = $filter('sort')(owners);

            if(angular.equals(sortedOwners, sortedFilters)){
                filtered.push(activity);
            }

        });
        return filtered;
    }
})

.filter('complete', function () {
    return function (items) {
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (angular.isObject(item.completion) && item.completion.done){
                filtered.push(item);
            }
        }
        return filtered;
    };
})

.filter('uncomplete', function () {
    return function (items) {
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!angular.isObject(item.completion) || !item.completion.done){
                filtered.push(item);
            }
        }
        return filtered;
    };
})

.filter('personal', function () {
    return function (items) {
        console.log("hello");
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!angular.isDefined(item.private) || !item.private){
                filtered.push(item);
            }
        }
        return filtered;
    };
})

.filter('stringInObj', function(){ //is the 1 filtered user in the owners array
    return function(items, string, objLoc) {
        var filtered = [];
        if(angular.isArray(items) && angular.isString(string)) {

            angular.forEach(items, function (item) {
                angular.forEach(item[objLoc], function (toggle, name) {
                    if (name === string && toggle) {
                        filtered.push(item);
                        return;
                    }
                })
            });
        }
        return filtered;
    };
})

.filter('contextMatch', function () {
    return function (items, context) {
        if(context) {
            var filtered = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.context === context) {
                    filtered.push(item);
                }
            }
            return filtered;
        }
        return items;
    };
})

;

