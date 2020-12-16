
sed -i 's@%SPARQL_ENDPOINT%@'"$TEST"'@' index.html

/docker-entrypoint.sh