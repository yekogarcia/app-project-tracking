# --- ETAPA 1: Construcción de la SPA ---
FROM node:24-alpine AS builder

# Instalar pnpm de forma global en la imagen
RUN npm i -g pnpm

WORKDIR /app

# Copiar archivos de configuración de pnpm y dependencias
COPY package.json pnpm-lock.yaml* ./

# 👇 SOLUCIÓN: Evita el bloqueo de seguridad de pnpm omitiendo los scripts de instalación.
# Los binarios de esbuild y SWC funcionarán perfectamente porque ya vienen listos para ejecutarse.
RUN pnpm install --frozen-lockfile --ignore-scripts

# Recibir el argumento desde el docker-compose.yml
ARG VITE_URL_API
ENV VITE_URL_API=$VITE_URL_API

# Copiar todo el código del frontend
COPY . .

# Compilar el frontend (Aquí TypeScript y Vite se ejecutarán usando los binarios instalados)
RUN pnpm run build

# --- ETAPA 2: Servidor Web de Producción ---
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]