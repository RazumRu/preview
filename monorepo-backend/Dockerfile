FROM node:16.13.0-alpine as build

ENV WORKDIR=/usr/src/app
ENV BLUEBIRD_DEBUG=0
ARG APP_NAME
ENV APP_NAME ${APP_NAME}

WORKDIR $WORKDIR

RUN apk update && apk add --no-cache python3 make build-base gcc wget bash libc6-compat curl libx11-dev

COPY package.json yarn.lock \
    .prettierrc nest-cli.json \
     tsconfig.json tsconfig.build.json .eslintrc.js global.d.ts \
     $WORKDIR/
COPY libs $WORKDIR/libs/
# COPY assets $WORKDIR/assets/
COPY apps/$APP_NAME $WORKDIR/apps/$APP_NAME/

RUN yarn install
RUN yarn build ${APP_NAME}

FROM node:16.13.0-alpine as production

ENV WORKDIR /usr/src/app
ENV BLUEBIRD_DEBUG=0
ENV HTTP_PORT=5000
ARG APP_NAME
ENV APP_NAME ${APP_NAME}

WORKDIR $WORKDIR

COPY package.json yarn.lock nest-cli.json ./
COPY --from=build $WORKDIR/dist $WORKDIR/dist
COPY --from=build $WORKDIR/node_modules $WORKDIR/node_modules

EXPOSE $HTTP_PORT

CMD yarn start:${APP_NAME}:prod
