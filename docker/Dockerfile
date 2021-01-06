FROM nginx:alpine

COPY index.html /data/

COPY entrypoint-replace-env.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/entrypoint-replace-env.sh