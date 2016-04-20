//= require app/app.js
//= require_self

angular.module('diffdemo').controller('demoController', ['$scope', '$http', '$controller', '$document', 'resUtil', function($scope, $http, $controller, $document, resUtil) {
    angular.extend(this, $controller("baseFormController", {$scope: $scope}));
    var $ctrl = this;
    $ctrl.wto = null;
    $ctrl.defaultErrorMessage = "Provided XML cannot be handled, please review input parameters";
    $ctrl.scrolling1 = false;
    $ctrl.scrolling2 = false;

    $scope.statusTexts = {
        "OK": "XML matches",
        "WARN": "Differences has been found. Review results",
        "ERROR": "",
        "ERROR2": $ctrl.defaultErrorMessage,
        "INFO": "Put you XML and press 'Start'",
        "INFO2": "In Progress"
    };

    $scope.xmlPathTooltip = 'Path to LIST elements that consists of NodeNames.\r\nFor example, path to INVENTORY element is "data.list.inventory":\r\n' +
        '<result>\r\n' +
        '    <id>getTrimInventory</id>\r\n' +
        '    <data>\r\n' +
        '        <list>\r\n' +
        '           <inventory>\r\n' +
        '               <vin>123456</vin>\r\n' +
        '               <acode>XGC60NIT161A0</acode>\r\n' +
        '           </inventory>\r\n' +
        '           <inventory>\r\n' +
        '               <vin>654321</vin>\r\n' +
        '               <acode>XGC60NIT161B0</acode>\r\n' +
        '           </inventory>\r\n' +
        '        </list>\r\n' +
        '    </data>\r\n' +
        '</result>\r\n';

    $scope.ignoredElementsTooltip = 'Format: "ignored1,ignored2=val1,@ignoredAttr2,ignored3.@ignoredAttr,ignored>ingoredChild.@ignoredAttrChild=val4"\r\n' +
        'ignored1 - all NODES with name "ignored1" will be ignored\r\n' +
        'ignored2=val1 - all NODES with name "ignored2" that has TEXT="val1" will be ignored\r\n' +
        '@ignoredAttr1 - all ATTRIBUTES with name "ignoredAttr1" will be ignored\r\n' +
        'ignored3.@ignoredAttr2 - all ATTRIBUTES with name "ignoredAttr2" that belongs to NODE with name "ignored3" will be ignored\r\n' +
        'ignored4>ingoredChild.@ignoredAttrChild=val4 - all NODES with name "ignored4" that have child NODE with name "ingoredChild" and ATTRIBUTE "ignoredAttrChild" with value "val4" will be ignored';

    this.init = function(){
        $('[data-toggle="tooltip"]').tooltip();

        var ta1 = $('#example_xml1');
        var ta2 = $('#example_xml2');
        ta1.bind('mouseup mousemove', function(){
            var curHeight = this.style.height.substr(0, this.style.height.length - 2) - 14;
            if(!$ctrl.oldHeight || curHeight != $ctrl.oldHeight){
                ta2.height(curHeight);
                $ctrl.oldHeight = curHeight;
            }
        }).bind("scroll", function(){
            if(!$ctrl.scrolling2){
                $ctrl.scrolling1 = true;
                ta2.scrollTop(ta1.scrollTop());
                setTimeout(function(){
                    $ctrl.scrolling1 = false;
                }, 100);
            }
        });
        ta2.bind('mouseup mousemove', function(){
            var curHeight = this.style.height.substr(0, this.style.height.length - 2) - 14;
            if(!$ctrl.oldHeight || curHeight != $ctrl.oldHeight){
                ta1.height(curHeight);
                $ctrl.oldHeight = curHeight;
            }
        }).bind("scroll", function(){
            if(!$ctrl.scrolling1){
                $ctrl.scrolling2 = true;
                ta1.scrollTop(ta2.scrollTop());
                setTimeout(function(){
                    $ctrl.scrolling2 = false;
                }, 100);
            }
        });
        $("textarea[id^='example_xml']").keyup(function() {
            clearTimeout($ctrl.wto);
            $ctrl.wto = setTimeout(function() {
                $("#origoutput").empty().append($ctrl.getDiffOutput($scope.curExample.xml1, $scope.curExample.xml2));
            }, 500);
        });

        $ctrl.getEntList("example", false, {mType: "nameId"}, function(){
            $ctrl.loadExample({id: -1});
        });
    };

    this.loadExample = function(item){
        if(!$scope.curExample || $scope.curExample.id != item.id) {
            resUtil["example"].get({id: item.id, mType: "deep"}, function (response) {
                $scope.curExample = response;
                $.each($scope.form_example, function (input) {
                    if (input.substr(0, 1) != "$") {
                        $ctrl.testXml();
                        $("#origoutput").empty().append($ctrl.getDiffOutput($scope.curExample.xml1, $scope.curExample.xml2));
                    }
                });
            });
        }
    };


    this.testXml = function(){
        if($scope.curStatus != 'INFO2'){
            $scope.curStatus = 'INFO2';
            $("#prepoutput").empty();
            $("#diffoutput").empty();

            $http({
                method: 'post',
                url: '/index/testXml',
                data: $scope.curExample
            }).then(function(response){
                $ctrl.compareResults(response.data.result.prep1, response.data.result.prep2, false);
                if(!response.data.result.passed){
                    $scope.curStatus = 'WARN';
                    $ctrl.compareResults(response.data.result.out1, response.data.result.out2, true);

                    if($scope.autoScroll){
                        var panel = $("#collapseDiffOutput");
                        panel.addClass("in").attr("aria-expanded", true).removeAttr("style");
                        $('html, body').animate({
                            scrollTop: panel.offset().top
                        }, 200);
                    }
                }else{
                    $scope.curStatus = 'OK';
                }
            }, function(response){
                if(response.data != null && response.data.errors != null){
                    $scope.curStatus = 'ERROR';
                    $scope.statusTexts.ERROR = response.data.errors;
                }else{
                    $scope.curStatus = 'ERROR2';
                    $("#error-body").html(response.data);
                }
            });
        }
    };

    this.compareResults = function(xml1, xml2, isDiff){
        var output;
        if(isDiff){
            output = $("#diffoutput");
        }else{
            output = $("#prepoutput");
        }
        output.empty().append($ctrl.getDiffOutput(xml1, xml2));
    };

}]);