# Resonance.ai Breakout Scanner

## Overview

This is a full-stack trading application called "Resonance.ai Breakout Scanner v12.5" that monitors cryptocurrency price movements and identifies potential breakout patterns. The application provides real-time scanning of multiple crypto pairs, configurable alert systems, and generates PineScript code for TradingView integration. It features a TradingView-style dark interface with comprehensive breakout detection algorithms based on price change thresholds, volume spikes, and customizable scanning modes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom trading-themed color variables and dark mode support
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Storage**: In-memory storage implementation with interface for potential database integration
- **Development**: Vite middleware integration for hot module replacement in development

### Data Storage Solutions
- **ORM**: Drizzle ORM with PostgreSQL dialect configuration
- **Database**: Configured for PostgreSQL using Neon Database serverless driver
- **Schema**: Strongly typed database schema with three main tables:
  - `breakout_configurations`: Stores scanning parameters and alert settings
  - `breakout_alerts`: Records detected breakout events with metrics
  - `pine_script_code`: Stores generated TradingView PineScript code
- **Current Implementation**: Memory-based storage for development with database interface ready for production

### Key Features and Components
- **Real-time Scanning**: Configurable cryptocurrency breakout detection with multiple scan modes (fast/medium/slow)
- **Alert System**: Visual and optional sound/email alerts for detected breakouts
- **Configuration Management**: Persistent settings for scan parameters, thresholds, and alert preferences
- **PineScript Generation**: Dynamic TradingView indicator code generation based on user configurations
- **Trading Interface**: Professional dark-themed UI mimicking TradingView with charts, controls, and status indicators

### Authentication and Authorization
- Currently no authentication system implemented
- Session management prepared with connect-pg-simple for future PostgreSQL session storage

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form with Zod resolvers
- **Build Tools**: Vite with TypeScript support, ESBuild for production builds
- **UI Components**: Comprehensive Radix UI component library (accordion, dialog, select, etc.)
- **Styling**: Tailwind CSS with PostCSS, class-variance-authority for component variants

### Database and ORM
- **Drizzle ORM**: Type-safe SQL query builder with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database provider (@neondatabase/serverless)
- **Session Storage**: connect-pg-simple for PostgreSQL-backed Express sessions

### Development and Utilities
- **Date Handling**: date-fns for date manipulation and formatting
- **Icons**: Lucide React icon library
- **Carousel**: Embla Carousel for React components
- **Command Menu**: cmdk for command palette functionality
- **State Management**: TanStack React Query for server state caching and synchronization

### Replit Integration
- **Development Tools**: Replit-specific Vite plugins for runtime error handling and cartographer integration
- **Build Configuration**: Custom Vite configuration optimized for Replit environment