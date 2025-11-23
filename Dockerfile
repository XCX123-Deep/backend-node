# Node.js 22 LTS lightweight production image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production && \
    npm cache clean --force

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 nodeuser && \
    chown -R nodeuser:nodeuser /app

USER nodeuser

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "server.js"]
