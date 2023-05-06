FROM node:16-alpine

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./

RUN npm ci

RUN npm install pm2 -g

COPY --chown=node:node . .


RUN npx prisma generate
RUN npx tsc --build
CMD npx prisma migrate deploy && \
    pm2-runtime pm2.config.js
