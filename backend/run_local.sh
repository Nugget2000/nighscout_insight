#!/bin/bash
# Script to run the backend server locally

# Navigate to the script's directory to ensure paths are correct
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Virtual environment not found. Creating and installing dependencies..."
    python3 -m venv .venv
    ./.venv/bin/pip install -r requirements.txt
fi

echo "Starting FastAPI server..."
# Run uvicorn using the virtual environment's executable
./.venv/bin/uvicorn main:app --reload
