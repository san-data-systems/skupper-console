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

# Ensure TypeScript files are compiled (if applicable)
RUN yarn ts-check

# Expose the desired port
EXPOSE 3000

# Environment variable for COLLECTOR_URL
ENV COLLECTOR_URL=""

# Command to start the application
CMD ["sh", "-c", "COLLECTOR_URL=$COLLECTOR_URL yarn start"]
