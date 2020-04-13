# CS316_project4


To run:


You must install :

  ```
  npm install express
  npm install path
  npm install conf
  npm install uuid
  ```
  
  
  Notes:
  
  Users are stored in a conf mapping. Their keys are generated using uuid 
  and look something like 'e2d70964-fc75-4115-b7ee-cf73f842aaf3'. 
  
  You can use data.get('e2d70964-fc75-4115-b7ee-cf73f842aaf3'). To get an object holding this user's values such as username password etc. { username: ' ... }
  
  All that needs to be done is routing and handlebars html for user pages dispalying thier information. 
