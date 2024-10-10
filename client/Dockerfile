# Dockerfile del frontend
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Incrementa el límite de memoria para el proceso de build
RUN node --max-old-space-size=1024 node_modules/.bin/react-scripts build

COPY . .

RUN npm run build

# Usamos Nginx para servir los archivos estáticos
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
