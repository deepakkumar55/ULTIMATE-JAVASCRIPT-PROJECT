# Dockerize a Node.js App

## Description

In this project, I will dockerize a Node.js app. We shall start off by building a simple Node.js app and then dockerize
it.

## Instructions

1. Create a new directory and navigate into it.

    ```bash
    mkdir app && cd app
    ```

2. Initialize a new Node.js project.

    ```bash
    npm init -y
    ```
   
3. Install the required packages.
   ```bash
    npm install express
    npm install -D nodemon
   ```

4. Create a new file `index.js` and add the following code.

    ```javascript
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
    });
    ```
   
5. Create a route in the `index.js` file.

    ```javascript
    app.get('/', (req, res) => {
     res.send('Hello World');
    });
    ```
   
6. Add a start script in the `package.json` file.

    ```json
   /* Other configurations */
    "scripts": {
     "start": "node index.js",
     "dev": "nodemon index.js"
    }
    ```
   
7. Create a Dockerfile.
   ```bash
    touch Dockerfile
   ```

8. Add the following code to the `Dockerfile`.

    ```Dockerfile
    FROM node:14
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    EXPOSE 3000
    CMD ["npm", "start"]
    ```
9. Build the Docker image.
   ```Dockerfile
    docker build -t node-app .
   ```

10. Run the Docker container.
    ```bash
    docker run -p 3000:3000 node-app
    ```

## Technologies Used

- Node.JS
- Express
- Docker
