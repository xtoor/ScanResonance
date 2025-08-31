#!/bin/bash
# Resonance.ai Breakout Scanner - unraid Setup Script
# Run this script in your /mnt/user/appdata/resonance-scanner/ directory

echo "🚀 Setting up Resonance.ai Breakout Scanner for unraid..."

# Create required directories
echo "📁 Creating directories..."
mkdir -p postgres data logs

# Set proper permissions for unraid
echo "🔒 Setting permissions..."
chown -R 99:100 postgres data logs
chmod -R 755 postgres data logs

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cp .env.example .env
    echo "📝 Please edit .env file with your settings before starting!"
    echo "   Especially change the POSTGRES_PASSWORD and DB_PASSWORD values."
else
    echo "✅ .env file already exists"
fi

# Display next steps
echo ""
echo "✅ Setup complete! Next steps:"
echo "1. Edit the .env file with your settings:"
echo "   nano .env"
echo ""
echo "2. Update these values in .env:"
echo "   POSTGRES_PASSWORD=your_secure_password"
echo "   DB_PASSWORD=your_secure_password"
echo ""
echo "3. Start the application:"
echo "   docker-compose up -d"
echo ""
echo "4. Access the scanner at:"
echo "   http://[unraid-ip]:5000"
echo ""
echo "📊 The scanner will be available with:"
echo "   • Real-time breakout detection"
echo "   • 330+ cryptocurrency pairs"
echo "   • Dynamic top coins selection"
echo "   • TradingView integration"
echo "   • Professional trading interface"