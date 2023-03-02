# develop stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# build project
RUN npm run build

# production stage
FROM httpd:2.4
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=build-stage /app/dist/ /usr/local/apache2/htdocs/
COPY .htaccess /usr/local/apache2/htdocs/.htaccess

EXPOSE 80
