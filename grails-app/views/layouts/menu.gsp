<g:applyLayout name="links">
<head>
    <title><g:layoutTitle/></title>
    <g:layoutHead/>
</head>
<body>
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="https://github.com/Klinton90/silly_diff" title="Diff App">
                    <p style="font-size: 30px;">
                        <asset:image src="logo.png"/>
                        Open on GitHub
                    </p>
                </a>
            </div>
        </div>
    </nav>
    <div class="container-fluid">
        <div style="min-height: 80vh;">
            <g:layoutBody/>
        </div>

        <footer class="footer">
            <hr>
            <p>Demo Diff App by Alex Tymofieiev. Review, download or fork on <a href="https://github.com/Klinton90/silly_diff">Github</a>. JavaScript Diff Library powered by <a href="http://github.com/cemerick/jsdifflib">jsdifflib</a>.</p>
        </footer>
    </div>
</body>
</g:applyLayout>