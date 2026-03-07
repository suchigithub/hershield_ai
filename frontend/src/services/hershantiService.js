import api from './api';

const hershantiService = {
  // ── Daily Wellness ──
  getDailyWellness: () => api.get('/hershanti/daily'),

  // ── Mood Journal ──
  getMoodEntries: (params) => api.get('/hershanti/mood', { params }),
  createMoodEntry: (data) => api.post('/hershanti/mood', data),
  getMoodAnalytics: (days) => api.get('/hershanti/mood/analytics', { params: { days } }),
  getReflectionPrompt: (mood) => api.get('/hershanti/mood/prompt', { params: { mood } }),
  deleteMoodEntry: (id) => api.delete(`/hershanti/mood/${id}`),

  // ── Meditation ──
  getMeditations: (category) => api.get('/hershanti/meditations', { params: { category } }),
  getMeditationById: (id) => api.get(`/hershanti/meditations/${id}`),
  completeMeditation: (id) => api.post(`/hershanti/meditations/${id}/complete`),
  getMeditationStats: () => api.get('/hershanti/meditations/stats'),

  // ── Therapists ──
  getTherapists: (params) => api.get('/hershanti/therapists', { params }),

  // ── Support Groups ──
  getGroups: () => api.get('/hershanti/groups'),
  createGroup: (data) => api.post('/hershanti/groups', data),
  joinGroup: (id) => api.post(`/hershanti/groups/${id}/join`),
  leaveGroup: (id) => api.post(`/hershanti/groups/${id}/leave`),
  getGroupMessages: (id) => api.get(`/hershanti/groups/${id}/messages`),
  postGroupMessage: (id, message) => api.post(`/hershanti/groups/${id}/messages`, { message }),
};

export default hershantiService;
