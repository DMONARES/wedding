// api/index.ts
export default {
  login: 'http://localhost:8080/login',
  addGuest: 'http://localhost:8080/guest',
  getGuests: 'http://localhost:8080/guests',
  editGuest: (id: number | string) => `http://localhost:8080/guest/${id}`,
  deleteGuest: (id: number | string) => `http://localhost:8080/guest/${id}`,
}
