FROM node:26-alpine AS build
WORKDIR /src
COPY . .
RUN npm ci --ignore-scripts && MORIA_URL=http://build-only npm run build

FROM node:26-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=build /src/build build
USER node
CMD ["node", "build"]
