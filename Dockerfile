FROM node:18.16-alpine3.16
WORKDIR /app

# ----------------
# Adicionando dependencia GIT
RUN apk update
RUN apk add pkgconfig

RUN apk --update --no-cache add git less openssh python3 make g++
RUN ln -sf python3 /usr/bin/python
# ----------------

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build:ts

CMD [ "node", "build/app.js" ]
