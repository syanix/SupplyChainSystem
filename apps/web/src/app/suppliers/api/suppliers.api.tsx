import { apiClient } from '../../api-client';
const API_URL = '/suppliers';
export const suppliersApi = {
  getAll: async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
  },
  getById: async id => {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  },
  create: async supplier => {
    const response = await apiClient.post(API_URL, supplier);
    return response.data;
  },
  update: async (id, supplier) => {
    const response = await apiClient.patch(`${API_URL}/${id}`, supplier);
    return response.data;
  },
  delete: async id => {
    await apiClient.delete(`${API_URL}/${id}`);
  },
};
