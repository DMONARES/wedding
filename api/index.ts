const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default {
  login: `${BASE_URL}/api/login`,
  addGuest: `${BASE_URL}/api/guest`,
  getGuests: `${BASE_URL}/api/guests`,
  editGuest: (id: number | string) => `${BASE_URL}/api/guest/${id}`,
  deleteGuest: (id: number | string) => `${BASE_URL}/api/guest/${id}`,
};
