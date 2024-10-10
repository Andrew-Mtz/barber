# Fase de construcción
FROM node:18-alpine AS build
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package*.json ./
RUN npm install

# Copia todo el código de la aplicación
COPY . .

# Aumenta el límite de memoria para evitar errores de falta de memoria en la construcción
RUN node --max-old-space-size=1024 node_modules/.bin/react-scripts build

# Fase de producción: usar Nginx para servir los archivos
FROM nginx:alpine

# Copiar los archivos de la carpeta build generada en la fase anterior a Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80 para acceder al servidor
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
