#!/bin/bash

echo "🏥 Starting Hospital Database Management System"
echo "=============================================="

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client && npm install && cd ..
fi

echo "🚀 Starting the application..."
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "⚠️  Make sure to:"
echo "1. Have MySQL running"
echo "2. Create the HospitalDB database by running: mysql < hospital_schema.sql"
echo "3. Update .env with your MySQL credentials"
echo ""

# Start both backend and frontend
npm run dev-all