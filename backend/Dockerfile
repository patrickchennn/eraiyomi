# Stage 1: Build
FROM node:18.20.4-alpine AS builder

WORKDIR /app/backend

# Ensure shared directory exists (this is only needed if not using volumes)
RUN mkdir -p /app/shared

# Copy `shared` directory to `/app/shared` (if using COPY)
COPY shared /app/shared

# Copy all necessary backend files
COPY ./backend/index.ts ./
COPY ./backend/src ./src
COPY ./backend/package*.json ./ 
COPY ./backend/.babelrc.json ./
COPY ./backend/tsconfig.prod.json ./
COPY ./backend/declaration.d.ts ./

# Install both `devDependencies` and `dependencies`
RUN npm install

# Build
RUN npm run build

# Debug: Ensure dist folder exists
RUN ls -la ./dist



# Stage 2: Production
FROM node:18.20.4-alpine
WORKDIR /app/backend

COPY ./backend/.env ./
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package*.json ./ 

# Install only `dependencies`
RUN npm install ---omit=dev

EXPOSE 8999

CMD ["npm", "start"]