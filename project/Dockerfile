FROM node:latest as build

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

RUN tsc

RUN npx prisma migrate deploy

CMD npm run prod
