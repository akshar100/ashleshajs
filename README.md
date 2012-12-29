AshleshaJS [![Build Status](https://travis-ci.org/akshar100/ashleshajs.png)](https://travis-ci.org/akshar100/ashleshajs)
==============================

AshleshaJS is a framework based on Express and YUI3. It helps build high performance, maintainable single page 
web applications based on best practices. 

With AshleshaJS you design your HTTP API first and then build a web application as a set of independent resuable components. 
Even thought AshleshaJS lets you build single page applications it also provides incremental enhancement support which means
for the browsers (and crawlers) not supporting Javascript the application still serves pages though with degraded features. 
 
Installation
-------------------------------

AshleshaJS requires NodeJS >=0.6.0, REDIS and CouchDB to be present on the machine.

Run the following command to install AshleshaJS

``git clone git://github.com/akshar100/ashleshajs.git``

Then run the following commands

 - sudo sh init.sh
 - node gear build


Visit http://localhost:8000/ to visit the web app. 

Heroku
--------------------------------
Ashlesha 2.0 will support Heroku. It is possible to simple deploy the application on the Heroku.
Currently the Bootstrap framework does not get compiled on Heroku and we are looking out for workarounds.


Development
--------------------------------

The main application file is appv2.js. This is where you tie the URLS to components

Creating your components
========================

Create the command

- node gear create 'module_name'


Roadmap
--------------------------------

- API does not support Sync methods

License
--------------------------------

Copyright 2012 Akshar Prabhu Desai

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.