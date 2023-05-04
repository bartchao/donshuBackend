<<<<<<< HEAD
FROM node:14.20.0-buster-slim

WORKDIR /donshuBackend
COPY package.json .
RUN npm install
COPY . .
CMD npm run stagging
=======
FROM node:14.20-slim

WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g nodemon
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .
EXPOSE 3000
CMD [ "nodemon","./bin/www" ]
>>>>>>> b7f355f (add docker env)
