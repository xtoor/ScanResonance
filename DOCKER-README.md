# 🐳 Resonance.ai Breakout Scanner - Docker Deployment

Complete Docker setup for unraid and other container platforms.

## 🚀 Quick Start (Docker Compose)

1. **Clone or extract the application**
2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```
3. **Edit `.env` with your settings** (especially change the default password!)
4. **Start the services:**
   ```bash
   docker-compose up -d
   ```
5. **Access the app:** http://localhost:5000

## 📦 unraid Installation

### Method 1: Docker Compose (Recommended)
1. Download the project files to `/mnt/user/appdata/resonance-scanner/`
2. Edit the `.env` file with your settings
3. Install the "Compose Manager" plugin from Community Applications
4. Add the docker-compose.yml file through Compose Manager
5. Start the stack

### Method 2: Manual Container Setup
1. Copy the `unraid-template.xml` to your unraid templates
2. Install from Community Applications or Docker tab
3. Configure the variables in the template
4. Start the container

## 🔧 Configuration

### Required Environment Variables
```env
# Database (REQUIRED - change the password!)
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://scanner_user:your_secure_password_here@postgres:5432/resonance_scanner

# Application
DEFAULT_SCAN_MODE=fast
MAX_CONCURRENT_SCANS=10
```

### Optional Features
```env
# Discord Alerts
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your/webhook

# Email Alerts
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🗂️ Volume Mounts

| Host Path | Container Path | Description |
|-----------|----------------|-------------|
| `/mnt/user/appdata/resonance-scanner/postgres` | `/var/lib/postgresql/data` | Database files |
| `/mnt/user/appdata/resonance-scanner/data` | `/app/data` | App configuration |
| `/mnt/user/appdata/resonance-scanner/logs` | `/app/logs` | Application logs |

## 🏥 Health Checks

The container includes health checks for:
- Application responsiveness
- Database connectivity
- API endpoint availability

## 🔒 Security

- Runs as non-root user (scanner:1001)
- Database with restricted permissions
- No sensitive data in logs
- Environment variable secrets

## 📊 Performance

### Resource Requirements
- **RAM**: 512MB minimum, 1GB recommended
- **CPU**: 1 core minimum, 2 cores recommended
- **Storage**: 5GB for database and logs
- **Network**: Internet connection for crypto data

### Optimization Tips
- Reduce `MAX_CONCURRENT_SCANS` on lower-end hardware
- Use SSD storage for database performance
- Monitor memory usage during heavy scanning

## 🔍 Monitoring

### Container Logs
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f resonance-scanner
docker-compose logs -f postgres
```

### Health Status
```bash
# Check container health
docker ps
docker inspect resonance-scanner | grep Health -A 10
```

### Application Metrics
- Access `/api/configurations` for scanner status
- Monitor alerts at `/api/alerts`
- View top coins at `/api/top-coins`

## 🛠️ Troubleshooting

### Database Issues
```bash
# Reset database (CAUTION: Deletes all data!)
docker-compose down -v
docker-compose up -d

# Check database logs
docker-compose logs postgres
```

### Application Issues
```bash
# Restart just the app
docker-compose restart resonance-scanner

# Check app logs
docker-compose logs -f resonance-scanner
```

### Permission Issues
```bash
# Fix unraid permissions
chown -R 1001:1001 /mnt/user/appdata/resonance-scanner/
```

## 🚀 Updates

```bash
# Pull latest images
docker-compose pull

# Restart with new images
docker-compose up -d

# Or rebuild if using local build
docker-compose build --no-cache
docker-compose up -d
```

## 🌐 Accessing the Application

- **Web Interface**: http://[unraid-ip]:5000
- **API Docs**: http://[unraid-ip]:5000/api/configurations
- **Health Check**: http://[unraid-ip]:5000/api/alerts

## 📱 Features Available

✅ **Real-time Breakout Scanner** - 330+ crypto pairs  
✅ **Multiple Scan Modes** - FAST/MEDIUM/SLOW  
✅ **Dynamic Top Coins** - Market-based coin selection  
✅ **TradingView Integration** - Pine Script generation  
✅ **Alert System** - Visual, Discord, Email  
✅ **Professional UI** - TradingView-style interface  

---

**Need help?** Check the logs first, then create an issue with your configuration and error details.