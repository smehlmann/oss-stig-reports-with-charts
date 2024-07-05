# OSS STIG Report Generator with Charts (oss-stig-reports-with-charts)

## Generate Build for Server

- Edit **_.env_** File
  - Change REACT_APP_REDIRECT_URI='http://localhost:3000' To #REACT_APP_REDIRECT_URI='http://localhost:3000'

    -  __#REACT_APP_REDIRECT_URI='http://localhost:3000'__
     - __REACT_APP_REDIRECT_URI='https://npc2ismsdev01.nren.navy.mil/stigmanossreports/'__

- Run npm run build.
  - When the build completes, edit index.js in the build folder.
    -   Search for all occurrences of  href="/static/…  to href="./static/… (Add a period before /static.) **(This must be adjusted for the specific server.)**
-  Open the file explorer and map a local drive to **\\npc2ismsdev01.nren.navy.mil\wwwSTIGMANOSSREPORTS$**
   - Go to the shared drive. Remove all content except web.config.
   - Copy from the build folder to the shared drive.
   - Test the build by going to [npc2ismsdev01.nren.navy.mil/stigmanossreports/](npc2ismsdev01.nren.navy.mil/stigmanossreports).



