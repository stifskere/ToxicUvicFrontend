
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY package.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "build" ]

ENTRYPOINT ["npm", "run", "start"]