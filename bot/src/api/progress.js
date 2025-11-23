const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/progress`;

export async function getProgressData(token) {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to load progress data');
  }

  return res.json();
}
