#!/bin/sh

if [ "$1" = "create" ]
	heroku create "$2"
	heroku config:add URL="$2"
elif [ "$2" = "push"]
	git push heroku master
fi
