#!/bin/bash

echo "🧪 Testing Hospital Database Application Setup"
echo "============================================="

echo "✅ Node.js Version: $(node --version)"
echo "✅ NPM Version: $(npm --version)"

echo ""
echo "📦 Backend Dependencies:"
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found"
fi

if [ -d "node_modules" ]; then
    echo "✅ Backend node_modules installed"
else
    echo "❌ Backend dependencies not installed - run: npm install"
fi

echo ""
echo "📦 Frontend Dependencies:"
if [ -f "client/package.json" ]; then
    echo "✅ client/package.json found"
else
    echo "❌ client/package.json not found"
fi

if [ -d "client/node_modules" ]; then
    echo "✅ Frontend node_modules installed"
else
    echo "❌ Frontend dependencies not installed - run: cd client && npm install"
fi

echo ""
echo "📄 Configuration Files:"
if [ -f ".env" ]; then
    echo "✅ .env file found"
else
    echo "❌ .env file not found"
fi

if [ -f "hospital_schema.sql" ]; then
    echo "✅ Database schema file found"
else
    echo "❌ Database schema file not found"
fi

if [ -f "server.js" ]; then
    echo "✅ Server file found"
else
    echo "❌ Server file not found"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Install MySQL and ensure it's running"
echo "2. Create the database: mysql < hospital_schema.sql"
echo "3. Update .env with your MySQL credentials"
echo "4. Run: npm install (if backend deps not installed)"
echo "5. Run: cd client && npm install (if frontend deps not installed)"
echo "6. Start the application: ./start.sh or npm run dev-all"