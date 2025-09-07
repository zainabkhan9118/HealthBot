const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/journal`;

// Get all journal entries for the logged-in user
export async function getJournalEntries(token) {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

// Add a new journal entry
export async function addJournalEntry(entryData, token) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(entryData)
  });
  return res.json();
}

// Update a journal entry
export async function updateJournalEntry(entryId, entryData, token) {
  const res = await fetch(`${API_URL}/${entryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(entryData)
  });
  return res.json();
}

// Delete a journal entry
export async function deleteJournalEntry(entryId, token) {
  const res = await fetch(`${API_URL}/${entryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}
