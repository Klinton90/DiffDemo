<!doctype html>
<html lang="en" class="no-js">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="${resource(dir:'images',file:'favicon.ico')}">
    <!-- <base href="${grailsApplication.config.grails.serverURL}" /> -->
    <title><g:layoutTitle default="Diff App"/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <asset:stylesheet src="application.css"/>
    <asset:stylesheet src="bootstrap.min.css"/>
    <asset:stylesheet src="bootstrap-ie10-fix.css"/>
    <asset:stylesheet src="bootstrap-theme.min.css"/>
    <asset:stylesheet src="default.css"/>
    <asset:stylesheet src="diffview.css"/>

    <asset:javascript src="jquery-2.1.4.min.js"/>
    <asset:javascript src="bootstrap.min.js"/>

    <g:layoutHead/>
</head>
<script type="application/javascript">
    var CONTEXTPATH = "${grailsApplication.config.custom.contextPath}";
</script>
<body>
    <g:layoutBody/>
</body>
</html>