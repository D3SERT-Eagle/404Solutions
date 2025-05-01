FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@11.3.0
RUN npm install --legacy-peer-deps

COPY . ./
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
