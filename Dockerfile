FROM node:lts

RUN mkdir /app
WORKDIR /app

COPY package.json yarn.lock tsconfig.json /app/
COPY ./src/* /app/src/

RUN yarn install
RUN yarn build

ENV PORT=8080
EXPOSE 8080

CMD ["yarn", "start"]