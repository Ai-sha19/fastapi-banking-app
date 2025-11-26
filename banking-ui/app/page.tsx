"use client";

import { useState } from "react";
import { authenticate, bankTransfer } from "../lib/api";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<{ name: string; bank_balance: number } | null>(null);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState<{ name: string; bank_balance: number } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authenticate(name, pin);
      setCurrentUser(data);
    } catch (err: any) {
      try {
        const parsedError = JSON.parse(err.message);
        if (parsedError.error) {
          setError(parsedError.error);
        } else {
          setError("An unknown error occurred.");
        }
      } catch (parseError) {
        setError(err.message || "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTransferSuccess(false);
    setReceiverInfo(null);

    if (!currentUser) {
      setError("You must be logged in to make a transfer.");
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError("Invalid amount.");
      return;
    }

    if (transferAmount > currentUser.bank_balance) {
      setError("Insufficient balance.");
      return;
    }

    setLoading(true);
    try {
      const data = await bankTransfer(name, receiverName, transferAmount);
      setCurrentUser({ ...currentUser, bank_balance: data.sender_balance });
      setTransferSuccess(true);
      // fetch receiver's balance
      const receiverData = await authenticate(receiverName, "0000"); // Assuming a default pin for receiver look up
      setReceiverInfo({name: receiverName, bank_balance: receiverData.bank_balance});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gradient">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {!currentUser ? (
              <div className="bg-white text-black p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">PIN</label>
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-orange-700 text-white p-2 rounded disabled:bg-orange-300">
                    {loading ? "Logging in..." : "Login"}
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
              </div>
            ) : (
              <div className="bg-white text-black p-4 rounded-lg">
                <h2 className="text-xl font-bold">Welcome, {currentUser.name}</h2>
                <p>Your balance is: PKR {currentUser.bank_balance.toFixed(2)}</p>
              </div>
            )}
          </div>

          {currentUser && (
            <div className="bg-white text-black p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Bank Transfer</h2>
              <form onSubmit={handleTransfer}>
                <div className="mb-4">
                  <label className="block mb-1">Receiver Name</label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-orange-700 text-white p-2 rounded disabled:bg-orange-300">
                  {loading ? "Transferring..." : "Transfer"}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {transferSuccess && <p className="text-green-500 mt-2">Transfer successful!</p>}
                {receiverInfo && (
                  <div className="mt-4">
                    <p>Updated receiver balance:</p>
                    <p>{receiverInfo.name}: PKR {receiverInfo.bank_balance.toFixed(2)}</p>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
