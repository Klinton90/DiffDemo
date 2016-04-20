<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="menu"/>
    <title>${title}</title>
    <asset:javascript src="app/controllers/demoController.js"/>
</head>
<body>
<div class="main" ng-app="diffdemo" ng-controller="demoController as dc" ng-init="dc.init();">
    <h1>Welcome to Silly_Diff Demo App</h1>
    <div class="row">
        <div class="col-md-2">
            <h4>Select test</h4>
            <g:btpText id="exampleFilter" label="Example List" ng-model="exampleFilter" placeholder="Quick search..."/>
            <div class="list-group searchable-list long-list">
                <button type="button" class="list-group-item text-nooverflow"
                        ng-repeat="item in exampleList | orderBy:'name' | findByNameOrId:exampleFilter:curExample.id track by item.id"
                        ng-class="{active : item.id == curExample.id}" ng-click="dc.loadExample(item)">{{item.name}}</button>
            </div>
        </div>
        <div class="col-md-10">
            <h4 ng-show="curExample != null">
                <span ng-show="curExample.id > 0">Selected example: </span>
                {{curExample.name}}
            </h4>
            <div class="well">
                {{curExample.description}}
            </div>
            <h4 ng-show="curExample == null">Select Example from list</h4>
            <div class="alert" role="alert" ng-class="{'OK':'alert-success', 'WARN':'alert-warning', 'ERROR':'alert-danger', 'ERROR2':'alert-danger', 'INFO':'alert-info', 'INFO2':'alert-info'}[curStatus]">
                Current status: {{statusTexts[curStatus]}}
            </div>
            <div class="panel panel-default" ng-show="curStatus == 'ERROR2'">
                <div class="panel-heading" role="tab" id="headingError">
                    <h4 class="panel-title">
                        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseError" aria-expanded="false" aria-controls="collapseError">
                            Errors
                        </a>
                    </h4>
                </div>
                <div id="collapseError" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingError">
                    <div id="error-body" class="panel-body"></div>
                </div>
            </div>
            <form name="form_example">
                <div class="row">
                    <div class="col-md-6">
                        <g:btpTextArea id="example_xml1" label="XML input 1" ng-model="curExample.xml1" placeholder="Paste XML text to that field" angError="true" style="margin-top: 0px; margin-bottom: 0px; height: 200px;"/>
                    </div>
                    <div class="col-md-6">
                        <g:btpTextArea id="example_xml2" label="XML input 2" ng-model="curExample.xml2" placeholder="Paste XML text to that field" angError="true" style="margin-top: 0px; margin-bottom: 0px; height: 200px;"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <g:btpLabelWithTooltip forId="xmlPath" label="XML Path" postTooltip="{{xmlPathTooltip}}" class="tooltipWithXml"/>
                        <g:btpText id="example_xmlPath" ng-model="curExample.xmlPath" placeholder="XML Path" angError="true"/>
                    </div>
                    <div class="col-md-6">
                        <g:btpLabelWithTooltip forId="ignoredElements" label="Ignored Elements" postTooltip="{{ignoredElementsTooltip}}" class="tooltipWithXml2"/>
                        <g:btpText id="example_ignoredElements" ng-model="curExample.ignoredElements" placeholder="Ignored Elements" angError="true"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <g:btpCheckbox id="example_orderlySafeMode" label="Set 'Y' to check elements order" ng-model="curExample.orderlySafeMode" ng-click="needleHelper = ''" angError="true"/>
                    </div>
                    <div class="col-md-6">
                        <g:btpCheckbox id="example_orderlySafeChildrenMode" label="Set 'Y' to check INNER elements order" ng-model="curExample.orderlySafeChildrenMode" angError="true"/>
                    </div>
                </div>
            </form>
            <div class="row">
                <div class="col-md-3">
                    <button type="submit" class="btn btn-block" ng-click="dc.testXml()" ng-disabled="statusXml == 'INFO2'">Start Testing</button>
                </div>
                <div class="col-md-3">
                    <g:btpCheckbox id="autoScroll" label="AutoScroll to Diff Output" ng-model="autoScroll"/>
                </div>
            </div>
            <div class="row" ng-show="statusXml == 'INFO2'">
                <div class="col-md-12">
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 100%">
                            <span>In Proccess</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true"> -->
                <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingOrigOutput">
                        <h4 class="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOrigOutput" aria-expanded="false" aria-controls="collapseOrigOutput">
                                Original XML
                            </a>
                        </h4>
                    </div>
                    <div id="collapseOrigOutput" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOrigOutput">
                        <div class="panel-body">
                            <div id="origoutput"></div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingPreOutput">
                        <h4 class="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapsePreOutput" aria-expanded="false" aria-controls="collapsePreOutput">
                                Prepared XML
                            </a>
                        </h4>
                    </div>
                    <div id="collapsePreOutput" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingPreOutput">
                        <div class="panel-body">
                            <div id="prepoutput"></div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingDiffOutput">
                        <h4 class="panel-title">
                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseDiffOutput" aria-expanded="false" aria-controls="collapseDiffOutput">
                                Found Differences
                            </a>
                        </h4>
                    </div>
                    <div id="collapseDiffOutput" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingDiffOutput">
                        <div class="panel-body">
                            <div id="diffoutput" ng-show="curStatus == 'WARN'"></div>
                        </div>
                    </div>
                </div>
            <!-- </div> -->
        </div>
    </div>
</div>
</body>
</html>