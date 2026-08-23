import api from './api';

/**
 * Fetch list of verified real estate agents
 */
export const getAgents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await api.get(`/agents${query ? `?${query}` : ''}`);
};

/**
 * Fetch single agent profile with their active listings
 */
export const getAgentById = async (id) => {
  return await api.get(`/agents/${id}`);
};
