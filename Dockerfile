# Use a Node.js base image
FROM node:23

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . ./

# Expose the desired port
EXPOSE 3000

# Environment variable for OBSERVER_URL
ENV OBSERVER_URL=""

# Command to start the application
CMD ["sh", "-c", "OBSERVER_URL=$OBSERVER_URL yarn start"]
