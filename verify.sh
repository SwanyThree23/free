#!/bin/bash

# SwanyThree Verification Script
# Checks that all required files and configurations are present

echo "🔍 SwanyThree Ultimate Edition - Verification Script"
echo "===================================================="
echo ""

errors=0
warnings=0

# Check required files
echo "📁 Checking required files..."

required_files=(
    "docker-compose.yml"
    "launch.sh"
    ".env.example"
    "README.md"
    "LICENSE"
    "backend/package.json"
    "backend/server.js"
    "backend/Dockerfile"
    "frontend/package.json"
    "frontend/src/App.jsx"
    "frontend/Dockerfile"
    "migrations/001_init.sql"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file MISSING"
        ((errors++))
    fi
done

echo ""

# Check .env file
echo "🔑 Checking environment configuration..."
if [ -f ".env" ]; then
    echo "  ✓ .env file exists"

    # Check for placeholder values
    if grep -q "your-evmux-api-key" .env 2>/dev/null; then
        echo "  ⚠ EVMUX_API_KEY not configured"
        ((warnings++))
    fi

    if grep -q "your-anthropic-api-key" .env 2>/dev/null; then
        echo "  ⚠ ANTHROPIC_API_KEY not configured"
        ((warnings++))
    fi

    if grep -q "your-openrouter-api-key" .env 2>/dev/null; then
        echo "  ⚠ OPENROUTER_API_KEY not configured"
        ((warnings++))
    fi
else
    echo "  ✗ .env file missing (copy from .env.example)"
    ((errors++))
fi

echo ""

# Check Docker
echo "🐳 Checking Docker..."
if command -v docker &> /dev/null; then
    echo "  ✓ Docker installed"

    if docker info &> /dev/null; then
        echo "  ✓ Docker daemon running"
    else
        echo "  ✗ Docker daemon not running"
        ((errors++))
    fi
else
    echo "  ✗ Docker not installed"
    ((errors++))
fi

if command -v docker-compose &> /dev/null; then
    echo "  ✓ Docker Compose installed"
else
    echo "  ✗ Docker Compose not installed"
    ((errors++))
fi

echo ""

# Check permissions
echo "🔐 Checking file permissions..."
if [ -x "launch.sh" ]; then
    echo "  ✓ launch.sh is executable"
else
    echo "  ⚠ launch.sh not executable (run: chmod +x launch.sh)"
    ((warnings++))
fi

if [ -x "verify.sh" ]; then
    echo "  ✓ verify.sh is executable"
else
    echo "  ⚠ verify.sh not executable"
    ((warnings++))
fi

echo ""

# Check directory structure
echo "📂 Checking directory structure..."

required_dirs=(
    "backend/services"
    "backend/routes"
    "backend/middleware"
    "frontend/src/components"
    "frontend/src/utils"
    "migrations"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir/"
    else
        echo "  ✗ $dir/ MISSING"
        ((errors++))
    fi
done

echo ""

# Summary
echo "===================================================="
echo "📊 Verification Summary"
echo "===================================================="

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo "✅ Perfect! All checks passed."
    echo ""
    echo "🚀 Ready to launch:"
    echo "   ./launch.sh"
    exit 0
elif [ $errors -eq 0 ]; then
    echo "⚠️  $warnings warning(s) found"
    echo ""
    echo "You can proceed, but consider addressing warnings:"
    echo "   - Configure API keys in .env file"
    echo ""
    echo "🚀 To launch anyway:"
    echo "   ./launch.sh"
    exit 0
else
    echo "❌ $errors error(s) and $warnings warning(s) found"
    echo ""
    echo "Please fix errors before launching."
    exit 1
fi
