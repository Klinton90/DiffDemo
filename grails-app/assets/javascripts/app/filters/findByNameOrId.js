//= require angular.min.js
//= require_self

angular.module('diffdemo').filter('findByNameOrId', function() {
    return function(items, textFilterValue, idsFilterValue, excludedIdsFilterValue, textFilterValuePath, idsFilterValuePath, excludedIdsFilterValuePath) {
        if(!items || !angular.isArray(items)){
            items = [];
        }
        if(!textFilterValue && !idsFilterValue && !excludedIdsFilterValue) {
            return items;
        }
        
        textFilterValuePath = textFilterValuePath || "name";
        var nameParts = textFilterValuePath.split(".");

        idsFilterValue = idsFilterValue || 0;
        var needles = [];
        if(angular.isNumber(idsFilterValue)){
            needles.push(idsFilterValue);
        }else if(angular.isArray(idsFilterValue)){
            if(!idsFilterValuePath){
                needles = idsFilterValue;
            }else{
                var idsParts = idsFilterValuePath.split(".");
                angular.forEach(idsFilterValue, function(idFilterValue){
                    var id = idFilterValue[idsParts[0]];
                    for(var i = 1; i < idsParts.length; i++){
                        id = id[idsParts[i]];
                    }
                    needles.push(id);
                });
            }
        }
        
        excludedIdsFilterValue = excludedIdsFilterValue || 0;
        var eNeedles = [];
        if(angular.isNumber(excludedIdsFilterValue)){
            eNeedles.push(excludedIdsFilterValue);
        }else{
            if(!excludedIdsFilterValuePath){
                eNeedles = excludedIdsFilterValue;
            }else{
                var excludedIdsParts = excludedIdsFilterValuePath.split(".");
                angular.forEach(excludedIdsFilterValue, function(excludedIdFilterValue){
                    var id = excludedIdFilterValue[excludedIdsParts[0]];
                    for(var i = 1; i < excludedIdsParts.length; i++){
                        id = id[excludedIdsParts[i]];
                    }
                    eNeedles.push(id);
                });
            }
        }
        
        return items.filter(function(item){
            var name = item[nameParts[0]];
            for(var i = 1; i < nameParts.length; i++){
                name = name[nameParts[i]];
            }
            
            return ((!textFilterValue || name.toLowerCase().indexOf(textFilterValue.toLowerCase()) > -1) || item.id == -1 || $.inArray(item.id, needles) >= 0) && $.inArray(item.id, eNeedles) == -1;
        });
    };
});