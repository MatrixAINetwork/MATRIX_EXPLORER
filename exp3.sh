#!/bin/bash
sed -i "s/192.168.3.64/$NODEIP/" config.json
mongod  --fork  --logpath=./db.log  --logappend
npm start 
