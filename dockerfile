# Stage 1: Build the app
FROM node:22.5.1-alpine3.19 as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app
FROM node:22.5.1-alpine3.19

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3040

CMD ["node", "dist/main"]
