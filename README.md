AshleshaJS
=============

NodeJS/Express based framework for building in-page modern web applications.

* MVC architecture at the backend and front end.
* Write an API that seamlessly works on client as well as on server. No more redundant code.
* Module based design. Write web pages as collection of self-contained modules.
* Determine which code goes to server and which code remains on server.
* Use Server Sent Events using Socket.IO which makes real-time communication possible.
* LocalStorage based caching for templates and models. (Falls back to memory on other browsers)
* Finetuned for A grade on YSlow. 
* Intergrated with CouchDB
* Runs JSHint, YUI compressort on the Javascript file, minifies and concatenates it into a single file.
* Capture events for data analysis at the server as well as client.(Similar to Mixpanel we we can capture events on server as well).

Configuration
--------------

- After you clone the repository run the command ```git submodules update``` 	This will refer to other git repositories.
- Install NodeJS
- Install the dependent node modules using the command ```npm install -g yui3 express redis nodemailer less```
- Since our framework uses Bootstrap you will also the need the modules required to compile bootstrap ```npm install recess uglify-js jshint -g``` 
- Modify the custom.properties file to configure your domain name and other server details
- Run ```ant all`` from the base directory
- Go to the build directory using command  ```cd build/ashlesha/``` and run ```node server.js```
- This will start the server on specified domain name at port 8888 (You can change the port number in custom.properties file)

Common Problems
-----------------

- Not tested on windows 
- Ant requires Java Runtime 

Documentation
-----------------

You can generate the documentation bu running ```ant docs```. This will run YUIDocs on the Javascript code and generate the documentation.

A file documentation.pdf is provided which gives the basic overview of the architecture and the philosophy behind design in an academic perspective.

Credits and Bugs
------------------
This framework is authored by Akshar Prabhu Desai. Many people helped conceptualize this framework and many people provided the neccessary resources. 
This code is realeased under MIT license. For any queries write to akshar at akshar.co.in 
