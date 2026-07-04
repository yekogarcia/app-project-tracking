# --- ETAPA 1: Construcción de la SPA ---
FROM node:24-alpine AS builder

# Instalar pnpm de forma global en la imagen
RUN npm i -g pnpm

WORKDIR /app

# Copiar archivos de configuración de pnpm y dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias usando pnpm
RUN pnpm install --frozen-lockfile

# Recibir el argumento desde el docker-compose.yml
ARG VITE_URL_API
# Convertirlo en variable de entorno para que Vite lo detecte al compilar
ENV VITE_URL_API=$VITE_URL_API

# Copiar todo el código del frontend
COPY . .

# Compilar el frontend (genera la carpeta /dist con HTML, JS y CSS estáticos)
RUN pnpm run build

# --- ETAPA 2: Servidor Web de Producción ---
FROM nginx:1.25-alpine

# Copiar el resultado de la compilación de Vite al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# EXPLICACIÓN OJO: Si usas React Router (rutas internas), Nginx necesita 
# una configuración especial para no dar error 404 al recargar páginas.
# Si te da error 404 al navegar, avísame para darte el archivo nginx.conf.

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]