//= require angular.min.js
//= require_self

angular.module('diffdemo').directive( 'elemReady', ['$parse', function( $parse ) {
    return {
        restrict: 'A',
        link: function($scope, elem, attrs){
            elem.ready(function(){
                $scope.$apply(function(){
                    var func = $parse(attrs.elemReady);
                    func($scope);
                })
            })
        }
    }
}]);