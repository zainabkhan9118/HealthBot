const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/dashboard`;

export async function getDashboardOverview(token) {
  const res = await fetch(`${API_URL}/overview`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to load dashboard data');
  }

  return res.json();
}

export async function getDashboardResources(token) {
  const res = await fetch(`${API_URL}/resources`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to load resources');
  }

  return res.json();
}

