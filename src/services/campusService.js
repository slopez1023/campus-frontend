import api from './api';
import { API_CONFIG } from '../config/constants';

export const campusService = {
  getAllCampuses: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.CAMPUSES);
      console.log('📋 Sedes obtenidas:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Error al obtener sedes:', error);
      throw new Error(error.response?.data || 'Error al obtener las sedes');
    }
  },

  createCampus: async (campusData) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.CAMPUSES, campusData);
      console.log('✅ Sede creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear sede:', error);
      throw new Error(error.response?.data || 'Error al crear la sede');
    }
  },

  deleteCampus: async (id) => {
    try {
      const response = await api.delete(API_CONFIG.ENDPOINTS.CAMPUS_BY_ID(id));
      console.log('✅ Sede eliminada');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al eliminar la sede');
    }
  }
};