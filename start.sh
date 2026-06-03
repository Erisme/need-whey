#!/bin/sh
node /app/api/index.js &
nginx -g 'daemon off;'
