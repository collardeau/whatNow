angular.module('myFilters', [])

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

.filter('userMatch', function () { //check if any item in array matches any key as true in an object
    return function (items, users) {
        if(angular.isDefined(users) && users.length > 0) {
            var filtered = [];
            for (var i = 0; i < items.length; i++) { //each item
                var item = items[i];
                for (var y = 0; y < users.length; y++) { //each filter
                    var filter = users[y];
                    if (item.owners[filter]) { //the owner of the item match the filtered item
                        filtered.push(item);
                        break;
                    }
                }
            }
            return filtered;
        }
        return items;
    };
});


