# 🚀 Resonance.ai Breakout Scanner v12.5

A professional full-stack cryptocurrency breakout scanner with real-time monitoring, TradingView integration, and dynamic top coins detection. This application provides comprehensive breakout pattern detection across 330+ cryptocurrency pairs with configurable scanning modes and alert systems.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Features Overview](#-features-overview)
- [Architecture](#-architecture)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core Scanning Features
- **Real-time Breakout Detection** - Monitors 330+ cryptocurrency pairs
- **Multiple Scan Modes** - FAST (1.3%), MEDIUM (1.8%), SLOW (2.4%) threshold modes
- **Dynamic Top Coins** - Automatically fetches top-performing coins based on volatility and liquidity
- **Volume Spike Detection** - Configurable volume ratio thresholds
- **TradingView Integration** - Generate Pine Script indicators for direct TradingView use

### 🔧 Configuration & Alerts
- **Flexible Configuration** - Customizable breakout parameters and thresholds
- **Alert System** - Visual alerts with optional sound notifications
- **Discord Integration** - Send breakout alerts to Discord channels
- **Pine Script Generation** - Dynamic indicator code creation
- **Professional UI** - TradingView-style dark theme interface

### 📊 Advanced Analytics
- **Real-time Charts** - Dynamic candlestick charts with breakout overlays
- **Volume Analysis** - Volume histogram and spike detection
- **Performance Metrics** - Scan statistics and breakout tracking
- **Top Coins Ranking** - Dynamic coin selection based on market performance

## 🔧 Prerequisites

Before installing the Resonance.ai Breakout Scanner, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`
- **PostgreSQL** (v13 or higher)
  - Download from: https://www.postgresql.org/download/
  - Or use a cloud service like Neon, Supabase, or AWS RDS

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 500MB free space
- **Internet Connection**: Required for real-time cryptocurrency data

## 🚀 Installation

### Step 1: Download and Extract
1. Download the `resonance-scanner-v12.5.zip` file
2. Extract to your desired directory:
   ```bash
   unzip resonance-scanner-v12.5.zip
   cd resonance-breakout-scanner
   ```

### Step 2: Install Dependencies
```bash
# Install all required packages
npm install

# Verify installation
npm list --depth=0
```

### Step 3: Database Setup

#### Option A: Local PostgreSQL
1. Create a new database:
   ```sql
   CREATE DATABASE resonance_scanner;
   CREATE USER scanner_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE resonance_scanner TO scanner_user;
   ```

2. Set your database URL in environment variables (see Configuration section)

#### Option B: Cloud Database (Recommended)
1. Sign up for a free account at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Create a new PostgreSQL database
3. Copy the connection string provided

### Step 4: Environment Configuration
1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@host:port/database"

   # Application Settings
   NODE_ENV=production
   PORT=5000

   # Optional: Discord Integration
   DISCORD_WEBHOOK_URL="your_discord_webhook_url"

   # Optional: Email Alerts
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your_email@gmail.com"
   SMTP_PASS="your_app_password"
   ```

### Step 5: Database Schema Setup
```bash
# Push the database schema
npm run db:push

# If you encounter issues, force the push
npm run db:push --force
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5000` |
| `DISCORD_WEBHOOK_URL` | Discord webhook for alerts | No | - |
| `SMTP_HOST` | Email server host | No | - |
| `SMTP_PORT` | Email server port | No | `587` |
| `SMTP_USER` | Email username | No | - |
| `SMTP_PASS` | Email password | No | - |

### Scanner Configuration

The application includes a configuration panel where you can adjust:

- **Scan Modes**: FAST, MEDIUM, or SLOW
- **Breakout Thresholds**: Custom percentage thresholds
- **Volume Ratios**: Minimum volume spike ratios
- **Alert Settings**: Sound, Discord, email notifications
- **Visual Settings**: Chart colors and indicators

## 🏃 Running the Application

### Development Mode
```bash
# Start in development mode with hot reload
npm run dev

# The application will be available at:
# http://localhost:5000
```

### Production Mode
```bash
# Build the application
npm run build

# Start the production server
npm start

# The application will be available at:
# http://localhost:5000
```

### Docker (Optional)
```bash
# Build Docker image
docker build -t resonance-scanner .

# Run with Docker Compose
docker-compose up -d
```

## 📡 API Documentation

### Configuration Endpoints

#### GET /api/configurations
Retrieve all scanner configurations
```json
{
  "configurations": [
    {
      "id": "1",
      "scanMode": "fast",
      "priceChangeThreshold": 1.3,
      "volumeRatio": 2.0,
      "alertsEnabled": true
    }
  ]
}
```

#### POST /api/configurations
Create a new configuration
```json
{
  "scanMode": "fast",
  "priceChangeThreshold": 1.3,
  "volumeRatio": 2.0,
  "alertsEnabled": true
}
```

### Alert Endpoints

#### GET /api/alerts
Retrieve breakout alerts
```json
{
  "alerts": [
    {
      "id": "1",
      "pair": "BTC-USD",
      "priceChange": 2.5,
      "volume": 1500000,
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Top Coins Endpoints

#### GET /api/top-coins
Fetch top performing coins
```json
{
  "coins": [
    {
      "product_id": "BTC-USD",
      "score": 10.5,
      "metrics": {
        "avg_usd_per_min": 50000,
        "last_close": 45000,
        "ret_stdev": 0.02
      }
    }
  ],
  "count": 50,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### POST /api/top-coins/refresh
Refresh top coins with custom parameters
```json
{
  "topN": 50,
  "minUsdPerMin": 2000,
  "maxSpreadPct": 0.005
}
```

### Pine Script Endpoints

#### GET /api/pine-script
Generate TradingView Pine Script code
```json
{
  "code": "// Generated Pine Script code...",
  "version": "5",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🎛️ Features Overview

### Scanner Dashboard
- **Real-time Status**: Live scanning status indicator
- **Scan Statistics**: Current pair, scan count, breakout count
- **Configuration Panel**: Adjust all scanner parameters
- **Alert History**: View recent breakout detections

### Top Coins Panel
- **Dynamic Ranking**: Real-time top 50 coin ranking
- **Filtering Options**: Volume, spread, and price filters
- **Performance Metrics**: Volatility scores and liquidity data
- **Scanner Integration**: Apply top coins to scanner automatically

### Chart Visualization
- **Candlestick Charts**: Real-time price data visualization
- **Breakout Overlays**: Visual breakout signal indicators
- **Volume Analysis**: Volume histogram and spike detection
- **Multiple Timeframes**: 1m, 5m, 15m, 1h chart intervals

### Alert System
- **Visual Alerts**: In-app breakout notifications
- **Sound Notifications**: Audio alerts for breakouts
- **Discord Integration**: Send alerts to Discord channels
- **Email Notifications**: Email alert delivery

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components with Radix UI
- **Styling**: Tailwind CSS with dark theme
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time Data**: Coinbase Advanced API integration

### Database Schema
```sql
-- Breakout Configurations
CREATE TABLE breakout_configurations (
  id SERIAL PRIMARY KEY,
  scan_mode VARCHAR(20),
  price_change_threshold DECIMAL,
  volume_ratio DECIMAL,
  alerts_enabled BOOLEAN
);

-- Breakout Alerts
CREATE TABLE breakout_alerts (
  id SERIAL PRIMARY KEY,
  pair VARCHAR(20),
  price_change DECIMAL,
  volume BIGINT,
  timestamp TIMESTAMP
);

-- Pine Script Code
CREATE TABLE pine_script_code (
  id SERIAL PRIMARY KEY,
  code TEXT,
  configuration_id INTEGER,
  created_at TIMESTAMP
);
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check database URL format
echo $DATABASE_URL

# Test database connection
npm run db:push

# Force schema update if needed
npm run db:push --force
```

#### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3000 npm run dev
```

#### Missing Dependencies
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### API Rate Limiting
If you encounter rate limiting from Coinbase:
1. Reduce scanning frequency in configuration
2. Implement request caching
3. Consider using multiple API keys

### Performance Optimization

#### Database Performance
```sql
-- Add indexes for better query performance
CREATE INDEX idx_alerts_timestamp ON breakout_alerts(timestamp);
CREATE INDEX idx_alerts_pair ON breakout_alerts(pair);
```

#### Memory Usage
- Monitor memory usage with `npm run stats`
- Reduce scan frequency for lower memory usage
- Implement data cleanup for old alerts

### Logs and Debugging
```bash
# View application logs
npm run logs

# Enable debug mode
DEBUG=* npm run dev

# Database query logging
DATABASE_LOGGING=true npm run dev
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Make your changes and test
6. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Add tests for new features

### Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@resonance.ai

## 🙏 Acknowledgments

- Coinbase Advanced Trade API for real-time data
- TradingView for Pine Script inspiration
- React and TypeScript communities
- All contributors and users

---

**Happy Trading! 📈🚀**

*Resonance.ai Breakout Scanner v12.5 - Professional Cryptocurrency Breakout Detection*