# Royal Jewels E-commerce Platform

This project consists of a frontend built with React and a backend built with Node.js and Express.

## Project Structure

```
royal-jewels/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory and add your environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

The backend server will start running on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

The frontend development server will start running on `http://localhost:3000`.

## Available Scripts

In the backend directory, you can run:

- `npm start`: Runs the server in production mode
- `npm run dev`: Runs the server in development mode with nodemon

In the frontend directory, you can run:

- `npm run dev`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm run lint`: Lints the source files
- `npm run preview`: Previews the built app

## Technologies Used

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Authentication: JSON Web Tokens (JWT)
- Payment Processing: Stripe

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.