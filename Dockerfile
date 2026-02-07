FROM node:26-alpine AS build

WORKDIR /app

COPY . .

RUN npm ci --ignore-scripts && npm run build

FROM node:26-alpine

WORKDIR /app

COPY package.json ./
COPY --from=build /app/build build/

EXPOSE 3000

ENV NODE_ENV=production ADDRESS_HEADER=X-Forwarded-For XFF_DEPTH=1

USER node

CMD ["node", "build"]
