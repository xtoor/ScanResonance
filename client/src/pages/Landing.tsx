import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Zap, Bell, Shield, BarChart3, Code } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-trading-dark text-trading-text">
      {/* Header */}
      <header className="border-b border-trading-border bg-trading-dark/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-bullish" />
              <h1 className="text-2xl font-bold">Resonance.ai Breakout Scanner</h1>
              <span className="text-sm bg-bullish/20 text-bullish px-2 py-1 rounded">v12.5</span>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-bullish hover:bg-bullish/90 text-white"
              data-testid="button-login"
            >
              Sign In with Replit
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-bullish to-warning bg-clip-text text-transparent">
            Professional Cryptocurrency Breakout Detection
          </h2>
          <p className="text-xl text-trading-muted mb-8 leading-relaxed">
            Real-time scanning across 330+ crypto pairs with advanced breakout algorithms, 
            Discord alerts, and TradingView Pine Script generation. Built for serious traders.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-bullish hover:bg-bullish/90 text-white px-8 py-4 text-lg"
              data-testid="button-get-started"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-trading-border text-trading-text hover:bg-trading-card px-8 py-4 text-lg"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Powerful Features for Pro Traders</h3>
          <p className="text-trading-muted text-lg">Everything you need to spot breakouts before they happen</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-trading-card border-trading-border">
            <CardHeader>
              <Zap className="w-10 h-10 text-bullish mb-2" />
              <CardTitle>Real-time Scanning</CardTitle>
              <CardDescription className="text-trading-muted">
                FAST/MEDIUM/SLOW modes across 330+ cryptocurrency pairs with live market data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-trading-card border-trading-border">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-warning mb-2" />
              <CardTitle>Advanced Detection</CardTitle>
              <CardDescription className="text-trading-muted">
                Delta (Δ) and Band Width (W) calculations with volume spike analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-trading-card border-trading-border">
            <CardHeader>
              <Bell className="w-10 h-10 text-accent mb-2" />
              <CardTitle>Smart Alerts</CardTitle>
              <CardDescription className="text-trading-muted">
                Discord webhooks, sound notifications, and customizable alert templates
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-trading-card border-trading-border">
            <CardHeader>
              <Code className="w-10 h-10 text-info mb-2" />
              <CardTitle>Pine Script Export</CardTitle>
              <CardDescription className="text-trading-muted">
                Generate TradingView indicators matching your exact scanner settings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-trading-card border-trading-border">
            <CardHeader>
              <BarChart3 className="w-10 h-10 text-success mb-2" />
              <CardTitle>Professional Interface</CardTitle>
              <CardDescription className="text-trading-muted">
                TradingView-style dark theme with real-time charts and candlestick analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-trading-card border-trading-border">
            <CardHeader>
              <Shield className="w-10 h-10 text-bullish mb-2" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription className="text-trading-muted">
                Built on Replit with secure authentication and persistent configurations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-trading-darker py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-12">Trusted by Crypto Traders</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-bullish mb-2">330+</div>
              <div className="text-trading-muted">Crypto Pairs Monitored</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-warning mb-2">24/7</div>
              <div className="text-trading-muted">Real-time Scanning</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">3</div>
              <div className="text-trading-muted">Scan Mode Options</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">Ready to Start Trading?</h3>
          <p className="text-trading-muted text-lg mb-8">
            Join professional traders using Resonance.ai to spot breakouts and maximize profits
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-bullish hover:bg-bullish/90 text-white px-8 py-4 text-lg"
            data-testid="button-start-trading"
          >
            Start Trading Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-trading-border bg-trading-darker py-8">
        <div className="container mx-auto px-4 text-center text-trading-muted">
          <p>&copy; 2024 Resonance.ai Breakout Scanner v12.5. Built for professional traders.</p>
        </div>
      </footer>
    </div>
  );
}