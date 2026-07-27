FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --ignore-scripts
EXPOSE 3000
ENV NODE_ENV=production
ENV ADDRESS_HEADER=X-Forwarded-For
ENV XFF_DEPTH=1
CMD ["node", "build"]
