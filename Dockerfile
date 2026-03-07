# ── Stage 1: Build Frontend ──
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV REACT_APP_API_URL=/api
RUN npm run build

# ── Stage 2: Production Server ──
FROM node:18-alpine
WORKDIR /app

# Copy backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --production

COPY backend/ ./backend/

# Copy frontend build from stage 1
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

WORKDIR /app/backend
CMD ["node", "server.js"]
