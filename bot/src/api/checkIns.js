const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/check-ins`;

// Get all check-ins for the logged-in user
export async function getCheckIns(token) {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

// Get a specific check-in by ID
export async function getCheckIn(checkInId, token) {
  const res = await fetch(`${API_URL}/${checkInId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

// Create a new check-in
export async function createCheckIn(checkInData, token) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(checkInData)
  });
  return res.json();
}

// Update a check-in
export async function updateCheckIn(checkInId, checkInData, token) {
  const res = await fetch(`${API_URL}/${checkInId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(checkInData)
  });
  return res.json();
}

// Delete a check-in
export async function deleteCheckIn(checkInId, token) {
  const res = await fetch(`${API_URL}/${checkInId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}
