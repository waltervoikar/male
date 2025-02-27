# docker build -t male/male:v2
FROM node:lts-alpine
RUN npm install -g serve
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY .. .
RUN npm run build
EXPOSE 8080
ENTRYPOINT [ "http-server", "dist" ]
