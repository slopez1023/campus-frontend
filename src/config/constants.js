export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    CAMPUSES: '/campuses',
    CAMPUS_BY_ID: (id) => `/campuses/${id}`
  }
};