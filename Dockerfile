FROM registry.opensource.zalan.do/library/node-12.20-alpine:latest


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
