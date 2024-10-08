# Stage 1: Build the app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Stage 2: Run the app
FROM node:18

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm install

COPY --from=build /app/dist ./dist

CMD ["node", "dist/main.js"]