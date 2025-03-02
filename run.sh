#!/bin/bash 
# Start the first process 
/fileflow & 
# Start the second process 
nginx -g 'daemon off;' & 
# Wait for any process to exit 
wait -n