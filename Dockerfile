FROM node:latest AS build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install --legacy-peer-deps

RUN npm run build

FROM nginx:latest

COPY --from=build /usr/local/app/dist/operation-cra/browser /usr/share/nginx/html

EXPOSE 80
