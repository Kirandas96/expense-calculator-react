# Expense Calculator - Full Stack Application

A modern, full-stack expense tracking application built with React, Node.js, Express, and MongoDB. Features user authentication, expense management, category tracking, budget monitoring, and beautiful data visualizations.

## Features

- 🔐 **User Authentication** - Secure login and registration with JWT tokens
- 💸 **Expense Management** - Add, edit, delete, and filter expenses
- 📁 **Category Management** - Create and manage custom categories with colors
- 🎯 **Budget Tracking** - Set overall or category-specific budgets with progress indicators
- 📊 **Data Visualization** - Interactive pie charts showing category distribution
- 📅 **Date Filtering** - Filter expenses and analytics by custom date ranges
- 💰 **INR Currency** - All amounts displayed in Indian Rupees (₹)
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Beautiful glassmorphism design with orange/peach theme

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Chart.js & react-chartjs-2
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
expense-calculator-react/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # Context providers
│   │   └── App.jsx
│   └── package.json
│
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # MongoDB models
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth & error middleware
│   │   └── server.js
│   └── package.json
│
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd "expense calculator react"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-calculator
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Note:** Replace `your_super_secret_jwt_key_change_this_in_production` with a strong, random string for production.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory (optional, defaults to localhost:5000):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in the backend `.env` file.

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Default Categories

When you create your first category, you can use the "Initialize Default Categories" button to add:
- Food, Fuel, Dress, Groceries, Transport, Entertainment, Bills, Healthcare, Shopping, Others

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Expenses
- `GET /api/expenses` - Get all expenses (protected)
- `POST /api/expenses` - Create expense (protected)
- `PUT /api/expenses/:id` - Update expense (protected)
- `DELETE /api/expenses/:id` - Delete expense (protected)

### Categories
- `GET /api/categories` - Get all categories (protected)
- `POST /api/categories` - Create category (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

### Budgets
- `GET /api/budgets` - Get all budgets (protected)
- `POST /api/budgets` - Create budget (protected)
- `PUT /api/budgets/:id` - Update budget (protected)
- `DELETE /api/budgets/:id` - Delete budget (protected)

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- All API routes (except auth) are protected
- Users can only access their own data

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Update `MONGODB_URI` to production database
3. Use a strong `JWT_SECRET`
4. Build frontend: `cd frontend && npm run build`
5. Serve frontend build files with a web server or integrate with backend

## License

This project is open source and available for personal use.

## Support

For issues or questions, please open an issue on the repository.

