-- Resonance.ai Breakout Scanner - Database Initialization
-- This file initializes the PostgreSQL database for the Docker deployment

-- Ensure the database and user exist
CREATE DATABASE IF NOT EXISTS resonance_scanner;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE resonance_scanner TO scanner_user;

-- Connect to the database
\c resonance_scanner;

-- Enable UUID extension for potential future use
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema (tables will be created by Drizzle ORM on first run)
-- This file just ensures proper permissions and extensions