# 🐳 Quick unraid Installation Guide

## 📦 Step 1: Extract Files
```bash
# Extract to unraid appdata directory  
tar -xzf resonance-scanner-unraid-advanced-sed-v12.5.tar.gz -C /mnt/user/appdata/
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
- ✅ **Advanced sed multiline** - Uses awk and multiple sed passes for precise pattern matching  
- ✅ **Alpine Linux compatible** - No Python3 dependency, works with node:18-alpine
- ✅ **Line-by-line replacement** - Manually skips multiline blocks and replaces with direct paths
- ✅ **Script permissions fix** - Automatically sets execute permissions on startup script  
- ✅ **Web UI accessibility** - Frontend template files found at correct Docker paths
- ✅ **DevDependencies install fix** - Build tools (vite, drizzle-kit) now properly installed
- ✅ **Special characters in passwords** now supported (`@`, `#`, `%`, etc.)  
- ✅ **Container restart loop** - No more infinite restart cycles

## 🔧 Troubleshooting:

### Web UI Not Accessible on Port 5000?
```bash
# Check if containers are running
docker-compose ps

# View application logs for errors
docker-compose logs resonance-scanner

# Restart the application container
docker-compose restart resonance-scanner

# If still not working, rebuild and restart
docker-compose down
docker-compose up -d
```

### Other Issues:
```bash
# View all logs
docker-compose logs -f

# Stop and remove (keeps data)
docker-compose down
```

**Features included:**
- Real-time scanning across 330+ crypto pairs
- Dynamic top coins selection
- TradingView Pine Script generation
- Professional trading interface
- Alert system (Visual, Discord, Email)