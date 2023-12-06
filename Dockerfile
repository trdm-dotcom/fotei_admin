FROM node:16.13.1

WORKDIR /usr/node-app

ENV NODE_SERVER_PORT=8081

COPY . .

WORKDIR server

RUN npm install

WORKDIR ..

RUN npm install

EXPOSE 8081

ENTRYPOINT ["npm", "run", "start:app" ]
