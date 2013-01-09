AshleshaJS [![Build Status](https://travis-ci.org/akshar100/ashleshajs.png)](https://travis-ci.org/akshar100/ashleshajs)
==============================

AshleshaJS is a framework based on Express and YUI3. It helps build high performance, maintainable single page 
web applications based on best practices _needs citation_ :). 

With AshleshaJS you design your web application as reusable components of three types. 
- Server Side components
- Common Components (which are seemlessly usable at client as well as server)
- Node Modules (Mostly to build components that are not neccessarily glued to web application)

You stich these components together for build complex web applications. A NPM like package management system ensures that 
distributing and loading these components is simple and hassel free.

AshleshaJS is not a CMS. It is not intended for non-developers.

Features
-------------------------------
- YUI3 App Framework which uses MVC at client side
- ExpressJS on the server side
- Model valdiations are written once but run on both server as well as client (like Meteor)
- One click deployment to heroku 
- File uploads to Amazon s3
- Amazon SES for email delivery (optional)
- Precompiled templates
- A grade for performance on YSlow
- A command line package manager to distribute and install components
- Default templating system used Twitter Bootstrap

 
Installation
-------------------------------

AshleshaJS requires NodeJS >=0.8.0 and CouchDB to be present on the machine. If you do not plan to use a database 
you need not install couchdb.

Run the following command to install AshleshaJS

``git clone git://github.com/akshar100/ashleshajs.git``

Then run the following commands

 - sudo sh scripts/init.sh 
 - node gear build test 
 - node gear build run


Visit http://localhost:8000/ to visit the web app. 

Heroku
--------------------------------
AshelshaJS support one click (or command) deployment to heroku. To deploy your application to heroku run the following command

- scripts/heroku.sh create myappname 
- scripts/heroku.sh push 

For Amazon s3 support for file uploads run

- heroku config:add s3key=yourkey
- heroku config:add s3secret=yoursecretkey
- heroku config:add s3bucket=bucketname
- git add .
- git commit -m "Your change log"
- ./heorku.sh push

Note: If there is no file to commit then modify some file and commit the changes. If you do not specify s3 configuration Heroku will not save any uploaded files.

Configuration
--------------------------------

All the primary configuration is available in config.js

**Amazon S3 Support**
AshleshaJS used Amazon S3 to maintain a common set of components which you may download. The bucket name is `ashlesha` and it is publicly available. 
Also, AshleshaJS is configured to store the uploaded files to amazon s3 buckets.

Whenever a user uploads a file through your application it get stored in s3bucket. Hence the key and secret is required. 
If you do not provide a key the files will be saved in build/public/static/uploaded folder. 

s3repobucket is our public bucket where we have provided a large number of components which provide very basic functionality that 
almost every app needs. Such as FormFields, Google and Yahoo Contacts importer, Google Maps Loader and so on.

You may configure amazon s3 with Ashlesha by adding following
three lines to your .bashrc file.

`vi ~/.bashrc`

Then paste the following 4 lines at the bottom

export s3key="Your s3 key, leave blank if you dont have one"
export s3secret="Your s3 secret leave blank if you dont have one"
export s3bucket="<use a bucket name>"
export s3repobucket="ashlesha"

It is better to leave the s3repobucket value untouched. 

Save .bashrc and run the following command

source ~/.bashrc 

**Note:** Amazon s3 support is totally optional. Even without amazon s3 key you will be able to download ashlesha modules from our public bucket. 


Development
--------------------------------

The main application file is appv2.js. This is where you tie the URLS to components

Creating your components
========================

Run the command for building a common component.

- node gear create 'module_name'

This will creaet a directory named module_name in ashlesha/components

The directory structure will consist of one Javascript file and one template file. The JS file is nothing but a YUI module. 

You are expected to write Models and Views in such files. (However you can write any other Javascript code.)


Roadmap
--------------------------------

- [] Tighter integration with Facebook, Google and Yahoo
- [] Package Manager to download relevant components 
- [] Separation of URL to View mapping 
- [] Canned Queries

License
--------------------------------

Copyright 2012 Akshar Prabhu Desai

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.