# Restaurant Booking System - Quick Start

## 🚀 Get Started in 5 Minutes

### 1️⃣ Install Dependencies

**Backend:**
\`\`\`bash
cd backend
npm install
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
\`\`\`

### 2️⃣ Setup PostgreSQL Database

\`\`\`bash
# Create database
createdb restaurant_booking

# Or using psql
psql -U postgres
CREATE DATABASE restaurant_booking;
\\q
\`\`\`

### 3️⃣ Configure Environment

**Backend** - Copy and edit `backend/.env.example` to `backend/.env`:
\`\`\`env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_booking
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD_HERE

# JWT
JWT_SECRET=your_secret_key_change_this
JWT_EXPIRE=7d

# Email (choose one)
# Option 1: SendGrid
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASSWORD=YOUR_SENDGRID_API_KEY

# Option 2: Gmail
# EMAIL_SERVICE=gmail
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASSWORD=your_gmail_app_password

EMAIL_FROM=noreply@urbanbistro.com

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend
CLIENT_URL=http://localhost:3000
\`\`\`

**Frontend** - Copy `frontend/.env.example` to `frontend/.env`:
\`\`\`env
VITE_API_URL=http://localhost:5000
\`\`\`

### 4️⃣ Start Redis

\`\`\`bash
# macOS
brew services start redis

# Or run directly
redis-server
\`\`\`

### 5️⃣ Seed Database (Optional)

\`\`\`bash
cd backend
node scripts/seed.js
\`\`\`

### 6️⃣ Run the Application

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm run dev
# Running on http://localhost:5000
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd frontend
npm run dev
# Running on http://localhost:3000
\`\`\`

### 7️⃣ Open Application

Visit: **http://localhost:3000**

## 📧 Email Setup Options

### SendGrid (Production - Recommended)
1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create API Key
3. Use in `.env`

### Gmail (Development)
1. Enable 2FA on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use in `.env`

## ✅ Verify Installation

1. Backend health: http://localhost:5000/api/health
2. Check browser console for Socket.io connection
3. Try registering a new account
4. Make a test booking

## 🆘 Troubleshooting

**Database connection failed:**
- Check PostgreSQL is running: `psql -U postgres -l`
- Verify credentials in `.env`

**Redis error:**
- Start Redis: `redis-server` or `brew services start redis`
- Check: `redis-cli ping` (should return PONG)

**Email not sending:**
- Check API key/app password
- Verify EMAIL_FROM is valid
- Check spam folder

**Port already in use:**
- Change PORT in `backend/.env`
- Change port in `frontend/vite.config.js`

## 🎯 Next Steps

1. Customize menu items in database
2. Configure email templates
3. Add admin authentication
4. Deploy to production

---

**Need help?** Check the main README.md for detailed documentation.
