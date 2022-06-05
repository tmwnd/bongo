#!/bin/bash

dir=$PWD
cd /var/www/virtual/tmwnd/bongo.tmwnd.de

printf "pull latest git changes:\n"
git pull
printf "\ninstall required npm packages:\n"
npm install
printf "\nrestart bongo systemd:\n"
supervisorctl restart bongo

cd $dir