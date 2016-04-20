//= require angular.min.js
//= require_self

angular.module('diffdemo').directive('lastReady', ['$parse', function ( $parse) {
    return {
        restrict: "A",
        link: function($scope, element, attrs){
            if($scope.$last === true){
                element.ready(function(){
                    $scope.$apply(function(){
                        var func = $parse(attrs.lastReady);
                        func($scope);
                    })
                })
            }
        }
    }
}]);