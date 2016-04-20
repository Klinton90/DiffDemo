//= require angular.min.js
//= require_self

angular.module('diffdemo').filter('hideByBool', function() {
    return function(items, filterVal, fieldName, inverseFilter, inverseVal) {
        if(!items){
            return [];
        }
        if (!filterVal) {
            return items;
        }
        if(!fieldName){
            fieldName = 'passed';
        }

        var nameParts = fieldName.split(".");

        return items.filter(function(item){
            var val = item[nameParts[0]];
            for(var i = 1; i < nameParts.length; i++){
                val = val[nameParts[i]];
            }

            return (inverseFilter ? !filterVal : filterVal) && (inverseVal ? !val : val);
        });
    };
});
