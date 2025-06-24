const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default {
  login: `${BASE_URL}/login`,
  addGuest: `${BASE_URL}/guest`,
  getGuests: `${BASE_URL}/guests`,
  editGuest: (id: number | string) => `${BASE_URL}/guest/${id}`,
  deleteGuest: (id: number | string) => `${BASE_URL}/guest/${id}`,
};
