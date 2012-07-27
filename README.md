AshleshaJS
=============

NodeJS/Express based framework for modern web applications.

Configuration
--------------

- After you clone the repository run the command 
	```
		git submodules update
	``` 
	This will refer to other git repositories.
- Install NodeJS
- Install the dependent node modules using the command ```npm install -g yui3 express redis nodemailer less```
- Since our framework uses Bootstrap you will also the need the modules required to compile bootstrap ```npm install recess uglify-js jshint -g``` 
- Modify the custom.properties file to configure your domain name and other server details
- Run 'ant all' from 