# BookMyShow

## About Project

This project is Laravel framework based which uses Vite + Reactjs for UI & MySql for RDBMS.

It facilitates the admins to create events and schedule it venue, date and time, while customers can book a ticket for the events and provide rating for the paid events.

## Project Setup

### in Windows wsl or Ubuntu

#### A light-weight command-line interface for interacting with Laravel's default Docker development environment.

To check and remove the existing docker images if any.

`usr1:/BookMyShow$ ./vendor/bin/sail down`

To rebuild docker images via. Laravel sail.

`usr1:/BookMyShow$ ./vendor/bin/sail build --no-cache`

To bring the docker container up.

`usr1:/BookMyShow$ ./vendor/bin/sail up -d`

#### Only need during first time project creation to add Laravel encryption token key.

`usr1:/BookMyShow$ ./vendor/bin/sail php artisan key:generate`

#### Run the migrations to set up your MySQL database

`usr1:/BookMyShow$ ./vendor/bin/sail php artisan migrate`

#### Install Node dependencies inside Docker

`usr1:/BookMyShow$ ./vendor/bin/sail npm install`

#### Start the Vite development server for React

`usr1:/BookMyShow$ ./vendor/bin/sail npm run dev`

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
