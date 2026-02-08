FROM php:8.2-apache

# Enable Apache modules
RUN a2enmod rewrite headers

# Copy files
COPY . /var/www/html/

# Create data directory with proper permissions
RUN mkdir -p /var/www/html/data \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 /var/www/html/data

# Create Apache configuration to disable directory indexing
RUN echo '<Directory /var/www/html/>\n\
    Options -Indexes +FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/api.conf

# Enable the configuration
RUN a2enconf api

EXPOSE 80
