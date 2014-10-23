/**
 * Created by thomascollardeau on 10/8/14.
 */

angular.module('whatNow.services', ['firebase'])

.factory("firebaseService", function($firebase){
        var url = 'https://what-now.firebaseio.com';
        var fireRef = new Firebase(url);

        var factory = {};
        factory.activities = $firebase(fireRef.child('activities'));

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
    return {
         //should call new on it, proper function class?
        newActivity: function(){
            return {
                title: undefined,
                urgent: false,
                important: false,
                duration: 1, //15 minutes increments
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
        },

        prep: function(activity){
            activity.title = activity.title.trim();
            activity.duration = parseInt(activity.duration);
            if (!activity.date) {
                activity.date = Firebase.ServerValue.TIMESTAMP;
            }
            //cleansing old activities
//            delete activity.urgency;
//            delete activity.completed;
//            delete activity.completedBy;
//            delete activity.forUsers;
            return activity;
        },

        getStatus: function(activity){
            //0: open
            //1: completed
            //2: urgent
            //3: important
            //4: urgent and important
            if(angular.isObject(activity.completion) && activity.completion.done){
                return 1;
            }
            else if(activity.urgent || activity.important) {
                if(!activity.important){
                    return 2;
                }else if (!activity.urgent && activity.important){
                    return 3;
                }
                return 4;
            }
            return 0;
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
            var owners = this.getTrueKeys(activity.owners);
            var doers = [];
            if (angular.isObject(activity.completion)){
                doers = this.getTrueKeys(activity.completion.by);
            }

            for(var i=0; i<doers.length;i++){
                for(var j=0; j<owners.length; j++){
                    if(doers[i] === owners[j]){
                        console.log("is not selfless");
                        return false;
                    }
                }
            }

            console.log("is selfless");
            return true;
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

