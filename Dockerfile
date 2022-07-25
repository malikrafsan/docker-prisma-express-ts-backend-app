FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN rm -rf node_modules
RUN npm install
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
# RUN npm i -g prisma
COPY . .
EXPOSE 5000

CMD [ "./startup.sh" ]

# RUN npx prisma migrate dev --name init --preview-feature
# CMD [ "startup.sh" ]
