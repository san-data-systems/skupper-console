# Use a Node.js base image
FROM node:23

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Expose the desired port (default for many web apps is 3000)
EXPOSE 3000

# Environment variable for COLLECTOR_URL
# This will be set at runtime using the `docker run` or `docker-compose` command.
ENV COLLECTOR_URL=""

# Command to start the application
# Pass the COLLECTOR_URL dynamically using environment variables
CMD ["sh", "-c", "COLLECTOR_URL=$COLLECTOR_URL yarn start"]
