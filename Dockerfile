FROM node:20-alpine3.19 AS build
WORKDIR /opt/app
# Install
COPY package*.json ./
RUN npm ci
# Build
COPY . .
COPY .env .env
#RUN npm run codegen
RUN npm run build

FROM nginx:stable-alpine3.19 AS production
# Copy build
COPY --from=build /opt/app/dist /usr/share/nginx/html
# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Expose ports
EXPOSE 80
# Run web server
#CMD ["nginx", "-g", "daemon off;"]
CMD ["/bin/sh", "-c", "\
  sed -i \"s#APP_BACKEND_URL#$APP_BACKEND_URL#g\" /etc/nginx/conf.d/default.conf \
  && nginx -g 'daemon off;'\
"]
