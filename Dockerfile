# Use the official Node.js image as the base image
FROM node:14-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json files to the app directory
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the app source code to the app directory
COPY . .

# Load environment variables from .env file
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY .env .

# Build the app
RUN npm i
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]
