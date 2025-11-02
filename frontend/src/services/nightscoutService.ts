const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const getEntries = async (date: string) => {
  const response = await fetch(`${BASE_URL}/entries?date=${date}`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const getKpis = async (date: string) => {
  const response = await fetch(`${BASE_URL}/kpis/${date}`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const getAnalysis = async (date: string) => {
  const response = await fetch(`${BASE_URL}/analysis/${date}`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
