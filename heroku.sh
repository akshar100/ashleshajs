#!/bin/sh

if [ "$1" = "create" ]
then
    heroku create "$2"
    heroku config:add URL="$2.herokuapp.com"
elif [ "$1" = "push" ]
then
    git push heroku master
else
    echo "Could not understand your command"
fi
