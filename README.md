# oss-stig-reports-with-charts
OSS STIG Report Generator with Charts

1.	Generate Build for Server
    a.	Edit .env
        i.	Change 
            REACT_APP_REDIRECT_URI='http://localhost:3000'
                To
            #REACT_APP_REDIRECT_URI='http://localhost:3000'
        ii.	Change (use appropriate url for the server)
            #REACT_APP_REDIRECT_URI='https://npc2ismsdev01.nren.navy.mil/stigmanossreports/'
                To
            #REACT_APP_REDIRECT_URI='https://npc2ismsdev01.nren.navy.mil/stigmanossreports/'
    b.	Run npm run build.
    c.	When the build completes, edit index.js in the build folder. Search for all occurrences of  href="/static/…  to href="./static/… (Add a period before /static.)
    d.	(This must be adjusted for the specific server.) Open the file explorer and map a local drive to \\npc2ismsdev01.nren.navy.mil\wwwSTIGMANOSSREPORTS$
        i.	Go to the shared drive. Remove all content except web.config.
        ii.	Copy from the build folder to the shared dreive.
    e.	Test the build by going to npc2ismsdev01.nren.navy.mil/stigmanossreports/.
