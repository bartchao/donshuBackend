# 本機開發用環境
FROM keymetrics/pm2:16-slim

WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
EXPOSE 3000
CMD [ "pm2-runtime", "start", "ecosystem.config.js"]
