
# chatRoom
Public chatroom with authentication

## Dev env setup
Install dependencies:

    npm install

Update `.env` file in the root directory:

    DB_HOST=localhost
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=auth_socket_db
    JWT_SECRET=your_jwt_secret_key

Start the server:

    npm start

OR for development with nodemon:

    npm run dev

Access the application at http://localhost:3000
