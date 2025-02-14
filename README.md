Product Company App
===================

The Product Company App is a backend API built using Node.js and Express.js. It allows managing products, companies, and users with MongoDB as the database. The API supports CRUD operations and provides endpoints for seamless interaction with the data.

Installation
------------

### Required Dependencies

To run this project, Node.js must be installed.

### 1\. Clone the Repository

    git clone https://github.com/dxtaner/product-company-nodejs
    cd product-company-nodejs

### 2\. Install Dependencies

    npm install

### 3\. Set Up Environment Variables

Create a `.env` file and add the following values:

    PORT=5000
    MONGO_URL=<MongoDB_Connection_URL>

Usage
-----

### Start the Server

    npm start

Or to run in development mode:

    npm run dev

Once the server is running successfully, you should see the following message:

    Server is running on port 5000.
    Connected to the database!

API Endpoints
-------------

### 1\. Home Page (Page Route)

*   `GET /`

### 2\. Users (User Route)

*   `GET /users` - Retrieves all users.
*   `POST /users` - Adds a new user.

### 3\. Companies (Company Route)

*   `GET /companies` - Retrieves all companies.
*   `POST /companies` - Adds a new company.

### 4\. Products (Product Route)

*   `GET /products` - Retrieves all products.
*   `POST /products` - Adds a new product.

Technologies
------------

*   **Node.js** - Backend server
*   **Express.js** - API framework
*   **MongoDB** - NoSQL database
*   **Mongoose** - MongoDB ORM
*   **dotenv** - Environment variable management
*   **cookie-parser** - Cookie handling
*   **cors** - CORS policies

Contributing
------------

If you would like to contribute to this project, you can follow these steps:

1.  Fork the repository
2.  Create a new branch (\`git checkout -b feature-branch\`)
3.  Make your changes and commit (\`git commit -m 'Added a new feature'\`)
4.  Push your changes to your branch (\`git push origin feature-branch\`)
5.  Create a pull request

License
-------

This project is licensed under the MIT License.
