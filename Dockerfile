FROM nginx:alpine
LABEL Name=lotus-web Version=0.0.1
RUN apk update && apk upgrade
COPY ["./src/main/resources/static/Page", "/usr/share/nginx/html"]
