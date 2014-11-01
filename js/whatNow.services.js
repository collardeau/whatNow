/**
 * Created by thomascollardeau on 10/8/14.
 */

angular.module('whatNow.services', ['firebase'])

.factory("firebaseService", function($firebase){
        var url = 'https://what-now.firebaseio.com';
        var fireRef = new Firebase(url);

        var factory = {};
        factory.activities = $firebase(fireRef.child('acties'));

        factory.users = $firebase(fireRef.child('users'));

        factory.add = function(newActivity){
            factory.activities.$add(newActivity);
        };

//        factory.save = function(id){
//            factory.activities.$save(id);
//        }
        return factory;

    })

.factory('activityFactory', function() {

    function Activity() {
        this.title= undefined;
        this.status= 0;
        this.urgent= false;
        this.important= false;
        this.private= false;
        this.duration= 1; //10 min
        this.completion= new ActivityCompletion();
        this.context= undefined;
        this.users= [];
        this.instructions= undefined;
        this.list= [];
    }

    function ActivityCompletion(){
        this.done = false;
        this.by = [];
        on: undefined;
        ptsGiven: 0;
    }

    return {
         //should call new on it, proper function class?
        newActivity: new Activity(),
        newCompletion: new ActivityCompletion(),

        prep: function(activity){
            activity.title = activity.title.trim();
            activity.duration = parseInt(activity.duration);
            if (!activity.date) {
                activity.date = Firebase.ServerValue.TIMESTAMP;
            }
            activity.status  = this.getStatus(activity);
            return activity;
        },

        getStatus: function(activity){
            if(angular.isObject(activity.completion) && activity.completion.done){
                return 1; //1: completed
            }
            else if(activity.urgent || activity.important) {
                if(!activity.important){
                    return 2; //2: urgent
                }else if (!activity.urgent && activity.important){
                    return 3; //3: important
                }
                return 4; //4: urgent and important
            }
            return 0; //0: open
        },

        isFun : function(activity){
            if(activity.context === "fun"){
                return true;
            }
            return false;
        },

        isSelfish: function(activity){
            var owners = this.getTrueKeys(activity.owners);
            if (owners.length === 1 && angular.equals(activity.owners, activity.completion.by)) {
                console.log("is selfish");
                return true;
            }
            return false;
        },

        isSelfless: function(activity){
            //if a doer
            var users = activity.users;
            var doers = activity.completion.by;

            for(var i=0; i<doers.length;i++){
                for(var j=0; j<users.length; j++){
                    if(doers[i] === users[j]){
//                        console.log("is not selfless");
                        return false;
                    }
                }
            }
//            console.log("is selfless");
            return true;
        },

        toggleInArray: function(array, string){
            var pos = array.indexOf(string);
            if(pos > -1) { //selection exists in the array
                array.splice(pos, 1);
            }else{
                array.push(string);
            }
            return array;
        },

        getTrueKeys: function(object){
            var keys = [];
            if(angular.isObject(object)) {
                angular.forEach(object, function (value, key) {
                    if(value) {
                        keys.push(key);
                    }
                });
            }
            return keys;
        }

    }
})

.factory('tagFactory', function() {
    return {
        contexts: [
            {name: 'home', icon: 'ion-disc'},
            {name: 'errand', icon: 'ion-bag'},
            {name: 'computer', icon: 'ion-monitor'},
            {name: 'fun', icon: 'ion-happy'}
        ],
        getContextNames : function (){
            var names = [];
            angular.forEach(this.contexts, function(context){
                names.push(context.name);
            });
            return names;
        },
        getContextIcons : function (){
            var icons = [];
            angular.forEach(this.contexts, function(context){
                icons.push(context.icon);
            });
            return icons;
        }
    }
});

