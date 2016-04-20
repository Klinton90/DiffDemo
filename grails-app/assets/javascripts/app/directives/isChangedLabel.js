//= require angular.min.js
//= require_self

angular.module('diffdemo').directive('isChangedLabel', [function(){
    var template =
        '<span>' +
            'Selected {{descr}}: <em>{{value.length > 0 && value.indexOf("fake") == -1 ? value : "Empty"}}</em> ' +
            '<span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign warn-visible text-danger" data-toggle="tooltip" data-original-title="{{tooltip}}" style="display: none;"></span>' +
        '</span>';
    return {
        template: template,
        restrict: 'E',
        replace: true,
        scope: {
            descr: '@',
            tooltip: '@',
            value: '='
        }
    };
}]);