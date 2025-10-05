FROM php:8.2-apache

RUN docker-php-ext-install pdo pdo_mysql && a2enmod rewrite

# Configure Apache document root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri -e 's!/var/www/!/var/www/html/public/!g' /etc/apache2/apache2.conf || true

COPY public/ /var/www/html/public/
COPY public/assets/ /var/www/html/public/assets/
COPY --chown=www-data:www-data public/ /var/www/html/public/

# Allow environment variables in PHP
ENV DB_HOST=db
ENV DB_PORT=3306
ENV DB_NAME=HospitalDB
ENV DB_USER=root
ENV DB_PASS=example

EXPOSE 80
CMD ["apache2-foreground"]
