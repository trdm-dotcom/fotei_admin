FROM node:16.13.1
RUN npm install && npm run java:jar:prod
