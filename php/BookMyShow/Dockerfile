# Use Sail's base image as starting point
FROM sail-8.5/app:latest

# Set working directory
WORKDIR /var/www/html

# Set Sail user environment variable
ENV WWWUSER=1000
ENV WWWGROUP=1000

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install Composer dependencies
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application files
COPY . /var/www/html

# Complete composer installation with autoloader (skip scripts)
RUN composer dump-autoload --optimize --no-dev --no-scripts

# Create required directories
RUN mkdir -p storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# Set permissions only on writable directories (ignore errors for Windows compatibility)
RUN chmod -R 777 storage bootstrap/cache 2>/dev/null || true

# Set supervisor environment variables - run as root to avoid privilege drop errors
ENV SUPERVISOR_PHP_COMMAND="/usr/bin/php -d variables_order=EGPCS /var/www/html/artisan serve --host=0.0.0.0 --port=80"
ENV SUPERVISOR_PHP_USER="root"

EXPOSE 80

# Use supervisord with the existing config
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
