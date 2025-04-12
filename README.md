# Express.js Backend

This is a backend application built with **Express.js**, a fast and minimalist web framework for Node.js. The project serves as a foundation for building RESTful APIs, with support for MongoDB integration, environment configuration, and basic routing.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- RESTful API setup with Express.js
- MongoDB integration for data persistence
- Environment variable management using `dotenv`
- Middleware for request parsing and error handling
- Basic routing for user-related operations

## Technologies

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **dotenv**: Environment variable management
- **Nodemon** (dev): Auto-restart server during development

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ductaip/Expressjs-Backend.git
   cd Expressjs-Backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and configure the required variables (see [Environment Variables](#environment-variables)).

4. **Start the MongoDB server**:
   Ensure MongoDB is running locally or provide a connection string to a remote MongoDB instance.

## Usage

1. **Run in development mode** (with Nodemon):

   ```bash
   npm run dev
   ```

2. **Run in production mode**:

   ```bash
   npm start
   ```

3. The server will start on the port defined in your `.env` file (default: `3000`). You can access the API at `http://localhost:3000`.

## API Endpoints

The following endpoints are available:

- `GET /api/users`: Retrieve all users
- `POST /api/users`: Create a new user
- (Add more endpoints as implemented)

> Note: Detailed endpoint documentation will be updated as the project evolves.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/your-database-name
NODE_ENV=development
```

- `PORT`: The port where the server runs
- `MONGO_URI`: MongoDB connection string
- `NODE_ENV`: Environment mode (`development` or `production`)

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).
