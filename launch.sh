#!/bin/bash

# SwanyThree Ultimate Edition - Launch Script
set -e

echo "🚀 SwanyThree Ultimate Edition - Starting..."
echo "================================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your API keys."
    echo ""
    echo "Required API keys:"
    echo "  - EVMUX_API_KEY"
    echo "  - EVMUX_APP_ID"
    echo "  - ANTHROPIC_API_KEY"
    echo "  - OPENROUTER_API_KEY"
    echo ""
    read -p "Press Enter to continue after updating .env file..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "🐳 Docker is running"

# Stop existing containers
echo "🛑 Stopping any existing containers..."
docker-compose down 2>/dev/null || true

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running"
else
    echo "❌ Some services failed to start"
    docker-compose logs
    exit 1
fi

echo ""
echo "================================================"
echo "✅ SwanyThree is ready!"
echo "================================================"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3000"
echo "💾 PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo ""
echo "📋 Quick Start:"
echo "  1. Open http://localhost:5173 in your browser"
echo "  2. Register a new account"
echo "  3. Start creating streams!"
echo ""
echo "📊 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
echo ""
echo "================================================"

# Follow logs
read -p "Press Enter to view live logs (Ctrl+C to exit)..."
docker-compose logs -f
