const API_URL = "http://localhost:8000";

export async function authenticate(name, pin) {
  const response = await fetch(`${API_URL}/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, pin_number: pin }),
  });

  if (!response.ok) {
    const error = await response.json();
    let errorMessage = "Authentication failed"; // Default message
    if (error.detail) {
      errorMessage = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function bankTransfer(sender_name, receiver_name, amount) {
  const response = await fetch(`${API_URL}/bank-transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sender_name, receiver_name, amount }),
  });

  if (!response.ok) {
    const error = await response.json();
    let errorMessage = "Bank transfer failed"; // Default message
    if (error.detail) {
      errorMessage = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
