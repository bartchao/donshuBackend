FROM node:14.20.0-buster-slim

WORKDIR /donshuBackend
COPY package.json .
RUN npm install
COPY . .
CMD npm run stagging