FROM --platform=$BUILDPLATFORM node:26-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts

COPY . .

RUN npm run build

FROM node:26-alpine

WORKDIR /app

COPY package.json ./
COPY --from=build /app/build build/

EXPOSE 3000

ENV NODE_ENV=production
ENV ADDRESS_HEADER=X-Forwarded-For
ENV XFF_DEPTH=1

USER node

CMD ["node", "build"]
