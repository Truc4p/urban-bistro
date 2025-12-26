# 🍽️ Urban Bistro - Restaurant Booking System

A full-stack restaurant booking system with real-time availability updates, menu management, and automated email confirmations.

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express** - RESTful API server
- **PostgreSQL** - Primary database with ACID transactions
- **Sequelize** - ORM for database operations
- **Redis** - Caching for availability data
- **Socket.io** - Real-time booking updates
- **Nodemailer** - Email confirmations (SendGrid/Gmail)
- **JWT** - Authentication

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Socket.io Client** - Real-time updates
- **Axios** - HTTP client
- **React Calendar** - Date picker
- **React Toastify** - Notifications

## 📁 Project Structure

```
restaurant-booking/
├── backend/
│   ├── config/
│   │   ├── database.js      # PostgreSQL configuration
│   │   ├── redis.js         # Redis client
│   │   └── email.js         # Email service
│   ├── models/
│   │   ├── Customer.js      # Customer model
│   │   ├── Table.js         # Table model
│   │   ├── Booking.js       # Booking model
│   │   ├── MenuItem.js      # Menu item model
│   │   └── index.js         # Model associations
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── bookings.js      # Booking management
│   │   ├── tables.js        # Table management
│   │   ├── menu.js          # Menu routes
│   │   └── customers.js     # Customer routes
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── server.js            # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Menu.jsx
    │   │   ├── Booking.jsx
    │   │   ├── MyBookings.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── socket.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## 🛠️ Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Redis (v7+)
- npm or yarn

### 1. Clone Repository
\`\`\`bash
git clone <your-repo-url>
cd restaurant-booking
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
\`\`\`

**Edit `.env` with your credentials:**
\`\`\`env
DB_NAME=restaurant_booking
DB_USER=postgres
DB_PASSWORD=your_password
EMAIL_PASSWORD=your_sendgrid_api_key  # Or Gmail app password
JWT_SECRET=your_secret_key
\`\`\`

### 3. Database Setup

\`\`\`bash
# Create PostgreSQL database
createdb restaurant_booking

# Or using psql:
psql -U postgres
CREATE DATABASE restaurant_booking;
\\q
\`\`\`

The database tables will be created automatically when you start the server (via Sequelize sync).

### 4. Frontend Setup

\`\`\`bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
\`\`\`

### 5. Start Redis

\`\`\`bash
# macOS (Homebrew)
brew services start redis

# Linux
sudo systemctl start redis

# Or run directly
redis-server
\`\`\`

## 🚀 Running the Application

### Start Backend (Terminal 1)
\`\`\`bash
cd backend
npm run dev
# Server runs on http://localhost:5000
\`\`\`

### Start Frontend (Terminal 2)
\`\`\`bash
cd frontend
npm run dev
# App runs on http://localhost:3000
\`\`\`

## 📧 Email Configuration

### Option 1: SendGrid (Recommended for Production)
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. In `.env`:
\`\`\`env
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=noreply@urbanbistro.com
\`\`\`

### Option 2: Gmail (Development)
1. Enable 2FA on your Google account
2. Generate an App Password
3. In `.env`:
\`\`\`env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
\`\`\`

## 🗃️ Database Models

### Customer
- UUID, firstName, lastName, email, phone
- Optional password (for registered users)
- Guest booking support

### Table
- UUID, name, capacity (1-20), location
- Active status for availability

### Booking
- UUID, customer, table, date, time range
- Guest count, special requests
- Status: pending, confirmed, cancelled, completed, no-show
- Unique constraint on (table, date, startTime)

### MenuItem
- UUID, name, description, category, price
- Image URL, availability, allergens

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login

### Bookings
- `GET /api/bookings/availability/:date` - Get available tables
- `POST /api/bookings` - Create booking
- `GET /api/bookings/customer/:customerId` - Get customer bookings
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Menu
- `GET /api/menu` - Get menu items (filter by category)
- `GET /api/menu/:id` - Get menu item details

### Tables
- `GET /api/tables` - Get all active tables
- `POST /api/tables` - Create table (admin)

## ⚡ Features

### Real-time Updates
- Socket.io broadcasts booking changes
- Automatic availability refresh
- Live table status

### Email Confirmations
- Automatic booking confirmation emails
- Includes booking details and ID
- HTML templates

### Caching
- Redis caches availability queries
- 5-minute cache TTL
- Auto-invalidation on booking changes

### Security
- JWT authentication
- Password hashing (bcrypt)
- Helmet.js security headers
- CORS protection

## 🧪 Testing

### Add Sample Data

Create a file `backend/scripts/seed.js`:
\`\`\`javascript
const { Table, MenuItem } = require('../models');

async function seed() {
  // Create tables
  await Table.bulkCreate([
    { name: 'Table 1', capacity: 2, location: 'Window' },
    { name: 'Table 2', capacity: 4, location: 'Main Hall' },
    { name: 'Table 3', capacity: 6, location: 'Patio' },
  ]);

  // Create menu items
  await MenuItem.bulkCreate([
    { name: 'Caesar Salad', category: 'appetizer', price: 12.99, isAvailable: true },
    { name: 'Grilled Salmon', category: 'main', price: 28.99, isAvailable: true },
    { name: 'Tiramisu', category: 'dessert', price: 9.99, isAvailable: true },
  ]);

  console.log('✅ Sample data created');
  process.exit(0);
}

seed();
\`\`\`

Run: `node backend/scripts/seed.js`

## 🚢 Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Add PostgreSQL and Redis add-ons
3. Deploy from GitHub

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to backend URL
2. Deploy from GitHub
3. Auto-rebuild on push

## 📝 Future Enhancements

- [ ] Admin dashboard
- [ ] Payment integration (deposits)
- [ ] SMS notifications (Twilio)
- [ ] Table layout visualization
- [ ] Waitlist functionality
- [ ] Reviews and ratings
- [ ] Multi-restaurant support
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Built for **Urban Bistro**

---

**Happy Coding! 🎉**
