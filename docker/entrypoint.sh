#!/bin/sh

sed -i 's@%SPARQL_ENDPOINT%@'"$SPARQL_ENDPOINT"'@' /usr/share/nginx/html/index.html
echo "Replaced %SPARQL_ENDPOINT% with $SPARQL_ENDPOINT"

/docker-entrypoint.sh nginx -g "daemon off;"