angular.module('whatNowFilters', [])

.filter('acties', function ($filter) {
    return function (activities, tags, criteria) {
        var filtered = activities;
        if(angular.isObject(activities) && angular.isArray(tags) && angular.isString(criteria)) {

            //who to filter against (beneficiaries or the doers)
            if(criteria === "benefactors"){
                criteria = "users"
            }else if (criteria === "doers"){
                criteria = "completion[by]"; //will this work
            }

            //user filtering
            var numUsersSelected = tags.length;
            switch (numUsersSelected) {
                case 0: //hide the personal activities if no users are selected
                    filtered = $filter('personal')(filtered);
                    break;
                case 1: //show if user being filtered is an owner of the activity
                    filtered = $filter('stringInArray')(filtered, tags[0], criteria);
                    break;
                default:  //show all in common
                    filtered = $filter('arrayMatch')(filtered, tags, criteria);
            }
            return filtered;
        }else{
            return activities;
        }
    };
})

.filter('stringInArray', function(){ //is the 1 filtered user in the owners array
    return function(items, string, arrayKey) {
        var filtered = [];
        if (angular.isArray(items) && angular.isString(string)) {

            angular.forEach(items, function (item) {
                angular.forEach(item[arrayKey], function (arrayString) {
                    if (string === arrayString) {
                        filtered.push(item);
                        return;
                    }
                })
            });
            return filtered;
        }else{
            console.log("passed in bad variable to stringInArray filter");
            return items;
        }
    };
})


.filter('arrayMatch', function($filter){
    return function(items, filters,  objKey){
        var filtered = [];
        if(angular.isArray(items) && angular.isArray(filters) && angular.isString(objKey)){

            var sortedFilters = $filter('sort')(filters);
            angular.forEach(items, function (item) {
                var arrayToCompare = item[objKey];
                var sortedArray = $filter('sort')(arrayToCompare);

                if (angular.equals(sortedArray, sortedFilters)) {
                    filtered.push(item);
                }

            });
            return filtered;
        }else{
            console.log("bad arguments in arrayMatch filter");
            return items;
        }
    }
})

.filter('complete', function(){
    return function(items){
        var filtered = [];
        angular.forEach(items,function(item){
            if (item.status === 1){
                filtered.push(item);
            }
        })
        return filtered;
    }
})

.filter('uncomplete', function(){
    return function(items){
        var filtered = [];
        angular.forEach(items,function(item){
            if (item.status !== 1){
                filtered.push(item);
            }
        })
        return filtered;
    }
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

//.filter('stringInObj', function(){ //is the 1 filtered user in the owners array
//    return function(items, string, objLoc) {
//        var filtered = [];
//        if(angular.isArray(items) && angular.isString(string)) {
//
//            angular.forEach(items, function (item) {
//                angular.forEach(item[objLoc], function (toggle, name) {
//                    if (name === string && toggle) {
//                        filtered.push(item);
//                        return;
//                    }
//                })
//            });
//        }
//        return filtered;
//    };
//})

//.filter('uncomplete-old', function () {
//    return function (items) {
//        var filtered = [];
//        for (var i = 0; i < items.length; i++) {
//            var item = items[i];
//            if (!angular.isObject(item.completion) || !item.completion.done){
//                filtered.push(item);
//            }
//        }
//        return filtered;
//    };
//})

//.filter('complete-old', function () {
//    return function (items) {
//        var filtered = [];
//        for (var i = 0; i < items.length; i++) {
//            var item = items[i];
//            if (angular.isObject(item.completion) && item.completion.done){
//                filtered.push(item);
//            }
//        }
//        return filtered;
//    };
//})

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

