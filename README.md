# ProspectMiner AI

<div align="center">

**An AI-powered lead generation and enrichment engine built for sales teams.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Local-green?style=flat-square&logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

</div>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

---

## Project Overview

ProspectMiner AI is a full-stack lead generation application that scrapes Google Maps for business listings, enriches them with website data, and uses AI to score leads.

**How it works:**

1. User enters search query (e.g., `"Dentists in Chicago"`) and lead limit
2. Backend creates a BullMQ job (in-memory queue)
3. Worker scrapes Google Maps using Puppeteer
4. Visits each website and extracts content
5. Enriches leads with services, email patterns, and scores (`High` / `Medium` / `Low`)
6. Saves to MongoDB and displays results in real-time

---

## Key Features

- ✅ **User Authentication** — JWT-based register/login system
- ✅ **Google Maps Scraping** — Stealth Puppeteer scraping with mock data fallback
- ✅ **Lead Enrichment** — Website crawling and AI-powered enrichment
- ✅ **Lead Scoring** — High/Medium/Low scoring based on website quality
- ✅ **Real-time Progress** — Live progress tracking during scraping
- ✅ **CSV Export** — Export leads to CSV with one click
- ✅ **Search History** — View and reload past searches
- ✅ **Analytics Dashboard** — Score distribution and performance metrics
- ✅ **Credit System** — 100 free credits on registration (1 credit = 1 lead)

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Context API | State management |
| Vite | Build tool |

### Backend

| Technology | Purpose |
|---|---|
| Node.js 18+ | Runtime environment |
| Express.js | REST API framework |
| MongoDB | Database (local) |
| JWT + bcrypt | Authentication |
| Puppeteer | Web scraping |
| BullMQ | Job queue (in-memory) |

---

## Prerequisites

| Tool | Version | Download |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| MongoDB | 7.0+ | https://mongodb.com/try/download/community |
| Git | Latest | https://git-scm.com |

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ProspectMiner-AI.git
cd ProspectMiner-AI
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Set Up MongoDB

```bash
# Create data directory
mkdir "C:\data\ProspectMiner AI"

# Start MongoDB (run in a separate terminal)
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\ProspectMiner AI"
```

### 5. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000

# Database (Local MongoDB)
MONGODB_URI=mongodb://localhost:27017/ProspectMiner-AI

# Auth
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Node Environment
NODE_ENV=development

# AI APIs (mock mode)
GEMINI_API_KEY=YOUR_API_KEY
GROQ_API_KEY=YOUR_API_KEY
```

---

## Running the Application

You need **4 terminals** running simultaneously:

**Terminal 1 — MongoDB**

```bash
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath C:\data\db
```

**Terminal 2 — Backend API Server**

```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 3 — Worker Process**

```bash
cd server
npm run worker
```

**Terminal 4 — Frontend**

```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### Quick Start Script (PowerShell)

Save as `start-app.ps1` in the project root:

```powershell
# Start MongoDB
Write-Host "Starting MongoDB..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& 'C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe' --dbpath C:\data\db"

Start-Sleep -Seconds 3

# Start Backend
Write-Host "Starting Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

# Start Worker
Write-Host "Starting Worker..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run worker"

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:5000/api/health" -ForegroundColor Cyan
```

---

## Project Structure

### Client

```
client/
├── public/                 # Static assets
├── src/
│   ├── api/               # API calls (axios)
│   │   ├── authApi.js
│   │   ├── scrapeApi.js
│   │   ├── historyApi.js
│   │   ├── analyticsApi.js
│   │   └── creditApi.js
│   ├── components/        # Reusable UI components
│   │   ├── Navbar/
│   │   ├── SearchBar/
│   │   ├── LeadsTable/
│   │   ├── ProgressBar/
│   │   ├── CreditBadge/
│   │   ├── ExportButton/
│   │   ├── LeadCard/
│   │   ├── ScoreBadge/
│   │   └── ProtectedRoute/
│   ├── pages/             # Page components
│   │   ├── LoginPage/
│   │   ├── RegisterPage/
│   │   ├── HomePage/
│   │   ├── ResultsPage/
│   │   ├── HistoryPage/
│   │   └── AnalyticsPage/
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useScrape.js
│   │   ├── useJobStatus.js
│   │   ├── useLeads.js
│   │   ├── useHistory.js
│   │   ├── useAnalytics.js
│   │   └── useCredits.js
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── LeadsContext.jsx
│   ├── utils/             # Helper functions
│   │   ├── exportCsv.js
│   │   ├── formatDate.js
│   │   ├── scoreColor.js
│   │   └── validators.js
│   ├── constants/         # App constants
│   │   ├── routes.js
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

### Server

```
server/
├── src/
│   ├── config/            # Configuration files
│   │   ├── db.js          # MongoDB connection
│   │   └── redis.js       # Redis connection (mock)
│   ├── middleware/        # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Lead.js
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── scrape/        # Scraping jobs
│   │   ├── enrichment/    # Lead enrichment
│   │   ├── history/       # Search history
│   │   ├── analytics/     # Analytics
│   │   └── credits/       # Credit system
│   ├── queue/             # Job queue
│   │   └── scrapeQueue.js
│   ├── scraper/           # Web scraping
│   │   ├── mapsScraper.js
│   │   └── websiteCrawler.js
│   └── utils/             # Utilities
│       ├── creditManager.js
│       ├── ApiError.js
│       └── textCleaner.js
├── server.js              # Express app entry
├── worker.js              # BullMQ worker entry
├── .env                   # Environment variables
└── package.json
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Scraping

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scrape` | Start scraping job |
| GET | `/api/scrape/status/:jobId` | Get job status |
| GET | `/api/scrape/leads/:jobId` | Get leads for job |

### History

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/history` | Get user's past jobs |
| DELETE | `/api/history/:jobId` | Delete job and leads |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Get analytics data |

### Credits

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/credits/balance` | Get credit balance |
| GET | `/api/credits/usage` | Get credit usage history |

---

## Troubleshooting

> Common issues and fixes will be documented here.

---

## Contributors

Saurav Kumar https://github.com/SauravKumar2015

---

## License

This project is licensed under the [MIT License](./LICENSE).