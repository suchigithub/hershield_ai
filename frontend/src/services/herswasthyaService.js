import api from './api';

const herswasthyaService = {
  // ── Dashboard ──
  getDashboard: () => api.get('/herswasthya/dashboard'),

  // ── Period Tracker ──
  getPeriodLogs: () => api.get('/herswasthya/period'),
  logPeriod: (data) => api.post('/herswasthya/period', data),
  getPeriodAnalytics: () => api.get('/herswasthya/period/analytics'),
  deletePeriodLog: (id) => api.delete(`/herswasthya/period/${id}`),
  getSymptoms: () => api.get('/herswasthya/symptoms'),

  // ── Health Tips ──
  getHealthTips: (category) => api.get('/herswasthya/tips', { params: { category } }),

  // ── Clinics ──
  getClinics: (params) => api.get('/herswasthya/clinics', { params }),

  // ── Telemedicine ──
  getDoctors: (params) => api.get('/herswasthya/doctors', { params }),
  bookConsultation: (data) => api.post('/herswasthya/consult', data),
  getConsultations: () => api.get('/herswasthya/consult'),
  cancelConsultation: (id) => api.post(`/herswasthya/consult/${id}/cancel`),

  // ── Workouts ──
  getWorkouts: (category) => api.get('/herswasthya/workouts', { params: { category } }),
  getWorkoutById: (id) => api.get(`/herswasthya/workouts/${id}`),
  completeWorkout: (id) => api.post(`/herswasthya/workouts/${id}/complete`),
  getWorkoutStats: (days) => api.get('/herswasthya/workouts/stats', { params: { days } }),

  // ── Planner ──
  getPlanner: () => api.get('/herswasthya/planner'),
  addPlannerEntry: (data) => api.post('/herswasthya/planner', data),
  deletePlannerEntry: (id) => api.delete(`/herswasthya/planner/${id}`),
  loadSuggestedPlan: (level) => api.post('/herswasthya/planner/suggested', { level }),

  // ── Coaches ──
  getCoaches: (params) => api.get('/herswasthya/coaches', { params }),
};

export default herswasthyaService;
