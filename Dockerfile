ARG NODE_VERSION=20.9.0
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

FROM base as build
COPY . .

# RUN yarn install && yarn run build
RUN yarn run build

FROM base as final

ENV NODE_ENV=production
USER node

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package.json .

EXPOSE 3000
CMD ["npx", "nest", "start", "restaurant"]