# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose port if API (skip if worker)
EXPOSE 3000

# Start service
# For api: npm start (starts Express server)
# For worker: npm start (runs worker script)
CMD [ "npm", "start" ]
