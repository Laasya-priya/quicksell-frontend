export const fetchTickets = async () => {
    const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch tickets");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  