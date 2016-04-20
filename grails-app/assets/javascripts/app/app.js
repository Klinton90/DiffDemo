//= require angular.min.js
//= require angular-resource.min.js
//= require_self

(function(){
    angular.module('diffdemo', ['ngResource'])
        .factory("resUtil", ['$resource', function($resource){
            var resUtil = {
                defaultConfig : {id: "@id"},

                extraMethods: {
                    update : {
                        method: "PUT"
                    }
                },

                add : function (config) {
                    var params,
                        url;

                    if (angular.isString(config)) {
                        config = {
                            resource: config,
                            url: "/" + config
                        };
                    }

                    if (!config.unnatural) {
                        var orig = angular.copy(resUtil.defaultConfig);
                        params = angular.extend(orig, config.params);
                        url = config.url + "s/:id";
                    } else {
                        params = config.params;
                        url = config.url;
                    }

                    var methods = config.methods || resUtil.extraMethods;

                    resUtil[config.resource] = $resource(url, params, methods);
                }
            };

            return resUtil;
        }])
        .factory('PathInterceptor', ['$location',function($location) {
            var path = {
                request: function(config) {
                    config.url = CONTEXTPATH+config.url;
                    return config;
                },
                response: function(response) {
                    return response;
                }
            };
            return path;
        }])
        .run(function(resUtil){
            resUtil.add({
                resource: "example",
                url: "/index",
                params: {
                    id: "@id"
                },
                methods: {
                    query:{
                        url: "/index/list",
                        isArray:true
                    },
                    get:{
                        url: "/index/show/:id"
                    }
                }
            });
        })
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.interceptors.push('PathInterceptor');
        }]);
})();

//= require app/directives/ignoreDirty.js
//= require app/directives/selectSearch.js
//= require app/directives/isChangedLabel.js
//= require app/directives/elemReady.js
//= require app/directives/lastReady.js
//= require app/filters/findByNameOrId.js
//= require app/filters/hideByBool.js
//= require app/controllers/baseFormController.js