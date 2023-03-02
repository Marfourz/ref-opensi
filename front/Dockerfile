# develop stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# build project
RUN npm run build

# production stage
#FROM nginx:1.23.3-alpine
#RUN rm -rf /usr/share/nginx/html/*
#COPY nginx.conf /etc/nginx/sites-enabled/nginx.conf
#COPY --from=build-stage /app/dist /usr/share/nginx/html
#CMD ["nginx", "-g", "daemon off;"]

FROM nginx:stable-alpine as production-stage
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
