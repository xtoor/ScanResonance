# 🐳 Quick unraid Installation Guide

## 📦 Step 1: Extract Files
```bash
# Extract to unraid appdata directory
tar -xzf resonance-scanner-docker-fixed-v12.5.tar.gz -C /mnt/user/appdata/
cd /mnt/user/appdata/resonance-breakout-scanner/
```

## ⚙️ Step 2: Setup Environment
```bash
# Run the automated setup script
./unraid-setup.sh

# Edit configuration with your password
nano .env
```

**Important: Change these values in .env:**
```env
POSTGRES_PASSWORD=spider1234@U
DB_PASSWORD=spider1234@U
```

## 🚀 Step 3: Start Services
```bash
# Start the scanner and database
docker-compose up -d

# Check status
docker-compose ps
```

## 🌐 Step 4: Access Scanner
- **Web Interface**: http://[unraid-ip]:5000
- **Scanner Dashboard**: Real-time breakout detection
- **Configuration Panel**: Adjust scan settings

## ✅ Fixed Issues:
- ✅ **Special characters in passwords** now supported (`@`, `#`, `%`, etc.)
- ✅ **Removed obsolete version field** from docker-compose.yml
- ✅ **No build required** - uses volume mounting for easier deployment
- ✅ **Automatic database setup** with schema migration

## 🔧 Troubleshooting:
```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop and remove (keeps data)
docker-compose down
```

**Features included:**
- Real-time scanning across 330+ crypto pairs
- Dynamic top coins selection
- TradingView Pine Script generation
- Professional trading interface
- Alert system (Visual, Discord, Email)