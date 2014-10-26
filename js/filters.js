angular.module('myFilters', [])


.filter('sort', function() {
    return function(input) {
        return input.sort();
    }
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

.filter('completed', function () {
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

.filter('uncompleted', function () {
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
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!angular.isDefined(item.personal) || !item.personal){
                filtered.push(item);
            }
        }
        return filtered;
    };
})

.filter('userInFilter', function(){ //is the 1 filtered user in the owners array
    return function(items, userInFilter) {
        var filtered = [];
        if(angular.isArray(items) && angular.isString(userInFilter)) {
            angular.forEach(items, function (item) { //each item
                angular.forEach(item.owners, function (owner, name) {
                    if (name === userInFilter && owner) {
                        filtered.push(item);
                        return;
                    }
                })
            });
        }
        return filtered;
    };
})

.filter('actie', function ($filter) {
    return function (items, complete, userFilter) {
        var filtered = [];
        if(complete){
            filtered = $filter('completed')(items);
        }else{
            filtered = $filter('uncompleted')(items);
        }

        //user tag filtering
        var numUsersSelected = userFilter.length;

        switch(numUsersSelected) {
            case 0: // if no users are selected, hide personal
                filtered = $filter('personal')(filtered);
                break;
            case 1:
                filtered = $filter('userInFilter')(filtered, userFilter[0]);
                break;
            default:  //activities in common
                //something
        }
        return filtered;
    };
})

;


var compareArrays = function(users, filters, isPersonal){
    var numFiltered = filters.length;
    switch(numFiltered) {
        case 0: // if not users are selected, hide personal
            if (isPersonal) {
                return false;
            }
            break;
        case 1: //hide if the user is not in filtered array
            var matched = false;
            //make this a filter?
            angular.forEach(users, function(user) {
                if(user === filters[0]){ //we know only 1 user
                    matched = true;
                    return;
                }
            });
            if(!matched){
                return false;
            }
            break;
        default:  //activities in common
            var users = $filter('sort')(users);
            var filters = $filter('sort')(filters);
            if(!angular.equals(users, filters)){
                return false;
            }
    }
    return true;
};

