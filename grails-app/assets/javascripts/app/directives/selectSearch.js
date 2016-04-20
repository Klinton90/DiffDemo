//= require angular.min.js
//= require_self

angular.module('diffdemo').directive('selectSearch', ['$document', function($document){
    var template =
        '<div name="{{id}}Grp" class="form-group" ng-class="{true:'+"'has-error'"+',false:'+"''"+'}[valMessage.length > 0]">' +
            '<input type="hidden" ng-model="model" id="{{id}}" name="{{id}}">'+
            '<label ng-transclude="label"></label>' +
            '<label ng-show="label.length > 0">{{label}}</label>' +
            '<br/>' +
            '<div class="btn-group bootstrap-select {{id}}-container">' +
                '<button type="button" class="btn dropdown-toggle btn-default text-nooverflow" ng-click="toggle()">{{model.name != null && model.id != 0 && model.id != -1 ? model.name : "Click to select"}}</button>' +
                '<div class="dropdown-menu list-group dropdown-200" id="{{id}}OptGrp">' +
                    '<input type="text" class="form-control input-sm" ng-model="tmpFilter" autocomplete="off" placeholder="Quick search..." ignore-dirty>' +
                    '<button type="button" class="list-group-item text-nooverflow input-sm" ng-repeat="option in options | orderBy:' + "'name'" + ' | findByNameOrId:tmpFilter:model.id track by option.id" ng-click="fill(option)">' +
                        '{{option[optKey]}}' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<span class="help-block" id="{{id}}Validation" name="{{id}}Validation">' +
                '{{valMessage}}' +
            '</span>' +
        '</div>';
    return {
        template: template,
        restrict: 'E',
        replace: true,
        transclude: {
            label: '?selectLabel',
        },
        scope: {
            id: '@',
            label: '@',
            optKey: '@',
            valMessage: '=',
            model: '=',
            options: '=',
            beforeCallback: '&',
            afterCallback: '&'
        },
        link: function(scope){
            if(scope.optKey == null || scope.optKey.length == 0){
                scope.optKey = 'name';
            }
            $document.bind('click', function(event){
                var target = $(event.target);
                var needle = scope.id + '-container';
                if(!target.hasClass(needle) && target.parents('.'+needle).length == 0){
                    $('#' + scope.id + 'OptGrp').hide();
                    scope.tmpFilter = '';
                }
            });
        },
        controller: ['$scope', function($scope){
            $scope.toggle = function(){
                if($scope.beforeCallback() == null || $scope.beforeCallback()(angular.copy($scope.model), $scope.id)) {
                    $('#' + $scope.id + 'OptGrp').toggle();

                    if($scope.afterCallback() != null && $scope.model != null){
                        $scope.afterCallback()(angular.copy($scope.model), $scope.id);
                    }
                }
            };

            $scope.fill = function(option){
                if($scope.beforeCallback() == null || $scope.beforeCallback()(angular.copy(option), $scope.id, true)){
                    $('#' + $scope.id + 'OptGrp').hide();
                    $scope.model = angular.copy(option);
                    $scope.tmpFilter = '';

                    if($scope.afterCallback() != null){
                        $scope.afterCallback()(angular.copy(option), $scope.id, true);
                    }
                }
            };
        }]
    };
}]);