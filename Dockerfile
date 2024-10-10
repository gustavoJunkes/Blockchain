# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of the app's code to the container
COPY . .

# Expose the default port
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
