<!doctype html>
<html>
    <head>
        <meta name="layout" content="menu"/>
        <title>${title}</title>
    </head>
    <body>
        <div class="row">
            <div class="col-md-2">
                <div id="status" role="complementary">
                    <h1>Application Status</h1>
                    <ul class="list-group">
                        <li class="list-group-item">Environment: <span class="badge">${grails.util.Environment.current.name}</span></li>
                        <li class="list-group-item">App profile: <span class="badge">${grailsApplication.config.grails?.profile}</span></li>
                        <li class="list-group-item">App version: <span class="badge">${grailsApplication.metadata.getApplicationVersion()}</span></li>
                        <li class="list-group-item">Grails version: <span class="badge">${GrailsUtil.grailsVersion}</span></li>
                        <li class="list-group-item">Groovy version: <span class="badge">${GroovySystem.getVersion()}</span></li>
                        <li class="list-group-item">JVM version: <span class="badge">${System.getProperty('java.version')}</span></li>
                        <li class="list-group-item">Reloading active: <span class="badge">${grails.util.Environment.reloadingAgentEnabled}</span></li>
                    </ul>
                    <h1>Artifacts</h1>
                    <ul class="list-group">
                        <li class="list-group-item">Controllers: <span class="badge">${grailsApplication.controllerClasses.size()}</span></li>
                        <li class="list-group-item">Domains: <span class="badge">${grailsApplication.domainClasses.size()}</span></li>
                        <li class="list-group-item">Services: <span class="badge">${grailsApplication.serviceClasses.size()}</span></li>
                        <li class="list-group-item">Tag Libraries: <span class="badge">${grailsApplication.tagLibClasses.size()}</span></li>
                    </ul>
                    <h1>Installed Plugins</h1>
                    <ul class="list-group">
                        <g:each var="plugin" in="${applicationContext.getBean('pluginManager').allPlugins}">
                            <li class="list-group-item">${plugin.name} - <span class="badge">${plugin.version}</span></li>
                        </g:each>
                    </ul>
                </div>
            </div>
            <div class="col-md-10">
                <div id="page-body" role="main">
                    <h1>Welcome to ${title}</h1>
                    <p>
                        This page is informational. It is used for development purposes. Links below give access to all available controllers in system, most of them are RESTful.
                    </p>

                    <div id="controller-list" role="navigation">
                        <h2>Available Controllers:</h2>
                        <ul>
                            <g:each var="c" in="${grailsApplication.controllerClasses.sort { it.fullName } }">
                                <li class="controller"><g:link controller="${c.logicalPropertyName}">${c.fullName}</g:link></li>
                            </g:each>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
