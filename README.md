# Project Overview
## FastAPI Banking Project

A simple banking system API built with FastAPI.
Includes user authentication and bank transfer using an in-memory dictionary.
Designed for beginners to understand FastAPI endpoints and basic API flow.git 

# Project Setup
## Project Setup

1. Initialize a minimal FastAPI project with `main.py`.
2. FastAPI server is run using Uvicorn on port 8000 with --reload.
3. Open http://localhost:8000 in browser to check the server.

## Endpoints

### 1. POST /authenticate
- Accepts user name and pin.
- Returns welcome message and bank balance if valid.
- Returns error if invalid user or pin.

### 2. POST /bank-transfer
- Accepts sender, receiver, and amount.
- Deducts amount from sender and adds to receiver.
- Returns error for insufficient funds or invalid users.

## Testing

- Use http://localhost:8000/docs to test APIs.
- First test /authenticate to check balances.
- Test /bank-transfer for:
  - Successful transfer
  - Insufficient funds
  - User not found
- After transfer, authenticate receiver to confirm balance updated.



