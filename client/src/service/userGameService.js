import api from './axios.mjs';

export const addGameToList = async (userId, gameId) => {
  const response = await api.post('/user-games/add', { userId, gameId });
  return response.data;
};

export const updateGameStatus = async (userId, gameId, status) => {
  const response = await api.put('/user-games/status', { userId, gameId, status });
  return response.data;
};

export const getUserGameList = async (userId) => {
  const response = await api.get(`/user-games/list/${userId}`);
  return response.data;
};

export const removeGameFromList = async (userId, gameId) => {
  const response = await api.delete(`/user-games/${userId}/${gameId}`);
  return response.data;
};