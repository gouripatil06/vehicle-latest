FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package.json ./backend/
COPY simulator/package.json ./simulator/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install --production

# Install simulator dependencies
WORKDIR /app/simulator
RUN npm install --production

# Copy backend source code
WORKDIR /app
COPY backend/ ./backend/

# Copy simulator source code
COPY simulator/ ./simulator/

# Expose backend port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server from backend directory
WORKDIR /app/backend
CMD ["node", "src/server.js"]
