FROM node:16-alpine as build

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./

RUN npm ci && npm cache clean --force

COPY --chown=node:node . .


RUN npx prisma generate
RUN npx tsc --build
RUN npx prisma migrate deploy

CMD npm run prod
