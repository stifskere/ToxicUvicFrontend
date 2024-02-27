
FROM node:18-alpine AS builder
WORKDIR ./
COPY package*.json ./
COPY package.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "build" ]

FROM nginx:alpine
COPY --from=builder ./dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]