from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# In-memory dictionary for users
# In a real application, this would be a database
users_db = {
    "alice": {"pin_number": "1234", "bank_balance": 50000},
    "bob": {"pin_number": "5678", "bank_balance": 20000},
    "charlie": {"pin_number": "1111", "bank_balance": 15000},
}

class AuthRequest(BaseModel):
    name: str
    pin_number: str

class TransferRequest(BaseModel):
    sender_name: str
    receiver_name: str
    amount: float

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/authenticate")
async def authenticate_user(request: AuthRequest):
    user_name = request.name.lower()
    pin_number = request.pin_number

    if user_name not in users_db:
        raise HTTPException(status_code=401, detail={"error": "Invalid user or pin"})

    user_data = users_db[user_name]

    if user_data["pin_number"] != pin_number:
        raise HTTPException(status_code=401, detail={"error": "Invalid user or pin"})

    return {"message": f"Welcome {user_name.capitalize()}", "bank_balance": user_data["bank_balance"]}

@app.post("/bank-transfer")
async def bank_transfer(request: TransferRequest):
    sender_name = request.sender_name.lower()
    receiver_name = request.receiver_name.lower()
    amount = request.amount

    if sender_name not in users_db or receiver_name not in users_db:
        raise HTTPException(status_code=404, detail={"error": "User not found"})

    if users_db[sender_name]["bank_balance"] < amount:
        raise HTTPException(status_code=400, detail={"error": "Insufficient funds"})

    users_db[sender_name]["bank_balance"] -= amount
    users_db[receiver_name]["bank_balance"] += amount

    return {
        "message": "Transfer successful",
        "sender_balance": users_db[sender_name]["bank_balance"],
        "receiver_balance": users_db[receiver_name]["bank_balance"],
    }
