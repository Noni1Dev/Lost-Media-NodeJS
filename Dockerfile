# Use a Node image that supports apt packages
FROM node:18-bullseye

# Install Python and FFmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    ln -s /usr/bin/python3 /usr/bin/python

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm ci

# Start your bot
CMD ["node", "bot.js"]
