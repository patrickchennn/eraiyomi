# Stage 1: Build stage
FROM node:18.20.4-alpine AS builder
WORKDIR /app

# Install necessary build dependencies for Alpine
RUN apk add --no-cache python3 g++ make

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm cache clean --force && npm install # Clean cache and install

# Copy source files and run the build process
COPY . .
RUN npm run build

# Stage 2: Final stage
FROM node:18.20.4-alpine
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
# RUN npm ci --only=production
RUN npm install --omit=dev

# Copy the build artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env

# Expose the desired port
EXPOSE 8999

# Start the application
CMD ["npm", "start"]
