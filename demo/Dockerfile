FROM nginx:alpine

COPY index.html /usr/share/nginx/html/

COPY entrypoint.sh /entrypoint-replace-env.sh

RUN chmod +x /entrypoint-replace-env.sh

ENTRYPOINT [ "/entrypoint-replace-env.sh" ]