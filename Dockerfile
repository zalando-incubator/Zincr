FROM registry.opensource.zalan.do/stups/node:11.8.0-44
RUN apt-get update && apt-get dist-upgrade -y
RUN sudo apt-get install git

WORKDIR /app
ENV LOG_LEVEL debug

COPY package.json ./
COPY tsconfig.json ./

RUN npm install typescript

RUN npm install --production
COPY lib ./lib

ENV NODE_ENV production
ENV APP_PORT 3000
EXPOSE 3000

CMD ["npm", "start"]
