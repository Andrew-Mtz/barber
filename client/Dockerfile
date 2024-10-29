# Usa una imagen base de Node.js
FROM node:16

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json (si existe) para instalar dependencias
COPY package*.json ./

# Instala las dependencias usando npm
RUN npm install

# Copia el resto del código del frontend a la imagen
COPY . .

# Genera una versión optimizada del frontend
RUN npm run build

# Expone el puerto 3000 para el servicio de archivos estáticos
EXPOSE 3000

# Comando para servir los archivos estáticos del frontend
CMD ["npx", "serve", "-s", "build"]
