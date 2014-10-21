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
       //should call new on it, proper function class?
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
        },
        getStatus: function(activity){

            if(angular.isObject(activity.completion) && activity.completion.done){
                return "completed";
            }
            else if(activity.urgent || activity.important) {
                if(activity.urgent && !activity.important){
                    return "urgent";
                }else if (!activity.urgent && activity.important){
                    return "important";
                }
                return "urgent and important";
            }
            return("open");
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

