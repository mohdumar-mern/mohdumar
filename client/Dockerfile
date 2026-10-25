# Stage 1: Build React app with Vite
FROM node:22-alpine3.22 AS builder

WORKDIR /app

# Install dependencies (using ci for reproducible builds)
COPY package*.json ./
RUN npm ci

# Build-time env vars (passed from docker-compose build.args)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy app source
COPY . .

# Build the production files
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:stable-alpine

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]