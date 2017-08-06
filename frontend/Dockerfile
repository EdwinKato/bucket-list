# Create image based on the official Node 6 image from dockerhub
FROM node:6

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

# Install dependencies
RUN rm -rf node_modules && npm install && npm cache clean && rm -rf ~/.npm

# Get all the code needed to run the app
COPY . /usr/src/app
