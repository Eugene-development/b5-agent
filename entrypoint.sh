#!/bin/sh

# SvelteKit Agent Entrypoint Script
# Reads Docker secrets and sets PUBLIC environment variables

echo "🚀 SvelteKit Agent starting with domain secrets resolution..."

# Read secrets if available and set PUBLIC environment variables
if [ -f "/run/secrets/frontend_url" ]; then
    export PUBLIC_FRONTEND_URL=$(cat /run/secrets/frontend_url)
    echo "✅ PUBLIC_FRONTEND_URL set from secret: $PUBLIC_FRONTEND_URL"
else
    echo "⚠️ No frontend_url secret found, using environment fallback"
fi

if [ -f "/run/secrets/api_base_url" ]; then
    export PUBLIC_API_BASE_URL=$(cat /run/secrets/api_base_url)
    echo "✅ PUBLIC_API_BASE_URL set from secret: $PUBLIC_API_BASE_URL"
else
    echo "⚠️ No api_base_url secret found, using environment fallback"
fi

if [ -f "/run/secrets/auth_api_url" ]; then
    export PUBLIC_AUTH_API_URL=$(cat /run/secrets/auth_api_url)
    echo "✅ PUBLIC_AUTH_API_URL set from secret: $PUBLIC_AUTH_API_URL"
else
    echo "⚠️ No auth_api_url secret found, using environment fallback"
fi

# Read secret values
FRONTEND_URL_VALUE=""
API_BASE_URL_VALUE=""
AUTH_API_URL_VALUE=""

if [ -f "/run/secrets/frontend_url" ]; then
    FRONTEND_URL_VALUE=$(cat /run/secrets/frontend_url)
fi

if [ -f "/run/secrets/api_base_url" ]; then
    API_BASE_URL_VALUE=$(cat /run/secrets/api_base_url)
fi

if [ -f "/run/secrets/auth_api_url" ]; then
    AUTH_API_URL_VALUE=$(cat /run/secrets/auth_api_url)
fi

# Create configuration file for the browser
mkdir -p /app/build/client
cat > /app/build/client/config.js << EOF
window.__APP_CONFIG__ = {
    API_BASE_URL: '${API_BASE_URL_VALUE:-http://localhost:8000}',
    AUTH_API_URL: '${AUTH_API_URL_VALUE:-http://localhost:8001}',
    FRONTEND_URL: '${FRONTEND_URL_VALUE:-http://localhost:5040}'
};
EOF

# Debug: Show resolved environment variables
echo "🔍 Configuration resolved:"
echo "  API_BASE_URL: ${API_BASE_URL_VALUE:-http://localhost:8000}"
echo "  AUTH_API_URL: ${AUTH_API_URL_VALUE:-http://localhost:8001}"
echo "  FRONTEND_URL: ${FRONTEND_URL_VALUE:-http://localhost:5040}"
echo "  NODE_ENV: $NODE_ENV"

# Start SvelteKit Agent application
echo "🌐 Starting SvelteKit Agent application..."
echo "📋 Command to execute: $@"

# Execute the command with proper signal handling
exec "$@"
