FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install --verbose

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start-dev" ]
