# Use pre-built nginx-rtmp image (much faster!)
FROM alfg/nginx-rtmp:latest

# Remove default config
RUN rm /etc/nginx/nginx.conf

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary directories
RUN mkdir -p /tmp/hls /tmp/dash && \
    chmod -R 777 /tmp/hls /tmp/dash

# Expose ports
EXPOSE 1935 8090

CMD ["nginx", "-g", "daemon off;"]