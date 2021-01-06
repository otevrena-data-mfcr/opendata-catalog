#!/bin/sh

WWW_ROOT=${WWW_ROOT:-"/usr/share/nginx/html"}
echo "WWW_ROOT=$WWW_ROOT"

SPARQL_ENDPOINT=${SPARQL_ENDPOINT:?"SPARQL_ENDPOINT environment variable must be set"}
echo "SPARQL_ENDPOINT=$SPARQL_ENDPOINT"

CATALOG_VERSION=${CATALOG_VERSION:-latest}
echo "CATALOG_VERSION=$CATALOG_VERSION"

cp /data/index.html "$WWW_ROOT/index.html"

sed -i 's@%SPARQL_ENDPOINT%@'"$SPARQL_ENDPOINT"'@' $WWW_ROOT/index.html
sed -i 's@%CATALOG_VERSION%@'"$CATALOG_VERSION"'@' $WWW_ROOT/index.html