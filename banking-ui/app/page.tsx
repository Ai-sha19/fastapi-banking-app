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


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authenticate(name, pin);
      setCurrentUser({ name: name, bank_balance: data.bank_balance });
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
    } catch (err: any) {
      try {
        const parsedError = JSON.parse(err.message);
        setError(parsedError.error || "An unknown transfer error occurred.");
      } catch (parseError) {
        setError(err.message || "An unknown transfer error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setError(""); // Clear any lingering errors
    setTransferSuccess(false); // Clear any lingering success messages
    setName(""); // Clear name input
    setPin(""); // Clear pin input
  };

  return (
  <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-700 text-white flex flex-col">
    <header className="w-full text-center py-6 px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-green-600">Al-Baraka Bank</h1>
      <p className="text-white text-base md:text-lg mt-2">Where Trust Meets Prosperity.</p>
    </header>

    <main className="w-full flex-grow flex items-center justify-center">
      <div className="w-full max-w-6xl px-6 py-12 mx-auto">
        {/* Parent flex: centers both columns. On md+ it becomes a row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          
          {/* LEFT: Text area - vertically centered with the box */}
          <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center">
            {currentUser ? (
              <>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-green-600">
                  Welcome, <span className="text-white">{currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1)}!</span>
                </h1>
                <p className="text-gray-300 text-lg md:text-2xl">
                  Your current balance: <span className="font-semibold text-white">PKR {currentUser.bank_balance.toFixed(2)}</span>
                </p>
                <button onClick={handleLogout} className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out">
                  Logout
                </button>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Effortless Banking, <span className="text-green-600">Elevated</span>.
                </h1>
                <p className="text-gray-400 text-base md:text-lg">
                  Manage your finances with our secure and intuitive platform. We offer a seamless digital experience, combining modern technology with reliable service.
                </p>
              </>
            )}
          </div>

          {/* RIGHT: Card area - fixed max width and centered */}
          <div className="w-full md:w-1/2 flex justify-center">
            {!currentUser ? (
              <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2">Client Access</h2>
                <p className="text-gray-400 mb-6">Securely log in to your dashboard</p>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-300">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                      placeholder="e.g. alice"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-300">Security PIN</label>
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold disabled:bg-green-400">
                    {loading ? "Logging in..." : "Secure Login"}
                  </button>
                  {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </form>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Bank Transfer</h2>
                <form onSubmit={handleTransfer}>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-300">Receiver Name</label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-300">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold disabled:bg-green-400">
                    {loading ? "Transferring..." : "Transfer"}
                  </button>
                  {error && <p className="text-red-500 mt-4">{error}</p>}
                  {transferSuccess && <p className="text-green-600 mt-4">Transfer successful!</p>}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  </div>
);
}