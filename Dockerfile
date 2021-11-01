FROM node:16.13.1-alpine AS build

RUN apk update && apk add curl bash && curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /var/app
ARG YARN_TIMEOUT=60000
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile --network-timeout $YARN_TIMEOUT
COPY . .
RUN yarn build
RUN npm prune --production && /usr/local/bin/node-prune


FROM node:16.13.1-alpine AS runtime
ARG VERSION="1.0.0"
ENV VERSION $VERSION
ENV NODE_ENV production
ENV TZ America/New_York
WORKDIR /home/node/app
RUN apk add dumb-init
USER node
EXPOSE 4000
COPY --chown=node:node --from=build /var/app/node_modules ./node_modules/
COPY --chown=node:node --from=build /var/app/dist ./dist
COPY package.json .

CMD [ "dumb-init", "node", "/home/node/app/dist/main.js" ]
