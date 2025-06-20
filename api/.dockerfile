# Etapa 1: build
FROM node:20-alpine as build

WORKDIR /app
COPY ./api ./api
WORKDIR /app/api

RUN yarn install
RUN yarn build

# Etapa 2: produção
FROM node:20-alpine

WORKDIR /api

COPY --from=build /app/api/dist ./dist
COPY --from=build /app/api/package.json ./
COPY --from=build /app/api/yarn.lock ./

RUN yarn install --production

EXPOSE 3000

CMD ["node", "dist/main"]
