# UNESCO Heritage Website
The UNESCO Heritage Website is a web application for exploring UNESCO World Heritage sites. 
It includes a client interface (HTML/CSS/JS) and a server-side C# application with a PostgreSQL database.

## Features

### User Features
- Registration and login
- View monuments
- Search monuments
- Read reviews

### Admin Features
- Add new monuments
- Manage "Collection of the Day"
- Edit monument data

## Database Information
This repository includes only the database schema (the structure of the tables) located in the /data/ folder.
The file contains:
- table definitions
- relationships
- constraints

The dump does NOT include any data.
Due to the large size of the full dump (over 130 MB), caused by images stored in Base64 format, it could not be uploaded to GitHub.
For this reason, only the clean structure of the database is provided.

You can recreate the database by importing the schema file and then manually adding monuments and collections through the admin panel in the application.

## Installation

### 1. Database Setup
- Create a new PostgreSQL database
- Import the schema file from database.sql
- The dump contains only table structure, no data

### 2. Server Setup
- Open the project in Visual Studio
- Update appsettings.json with your database connection
- Run the server

### 3. Client Setup
- Open main.html in your browser
