UNESCO Heritage Website

The UNESCO Heritage Website is a web application dedicated to exploring UNESCO World Heritage sites.
The project includes a client-side web application (HTML/CSS/JS) and a server-side application built with C# (.NET), as well as a PostgreSQL database used for storing information about monuments, users, reviews, and collections.

✨ Main Features
👤 User Features

User registration and authorization

Viewing UNESCO monuments

Searching for monuments

Viewing details of each site

Reading reviews

🛠 Admin Features

Creating new monuments

Creating the “Collection of the Day”

Deleting the daily collection

Managing monument data

Moderating content

⚙️ How to Run the Project
1. Set Up the Database

Open PostgreSQL or PGAdmin.

Create a new database.

Import the SQL file from the /data/ folder.

Remember your:

Database name

Port

Username

Password

2. Configure the Server

Open the server project in Visual Studio.

Open appsettings.json or appsettings.Development.json.

Update the connection string with your local PostgreSQL credentials, for example:

"DefaultConnection": "Host=localhost;Port=5432;Database=your_db_name;Username=your_user;Password=your_password"


Click Run to start the server.

3. Start the Client

Open the /client/ folder.

Run main.html in your browser.

The client will send requests to the server.
