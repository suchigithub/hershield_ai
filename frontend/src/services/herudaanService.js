import api from './api';

const herudaanService = {
  // ── Resume ──
  getResumes: () => api.get('/herudaan/resumes'),
  createResume: (data) => api.post('/herudaan/resumes', data),
  updateResume: (id, data) => api.put(`/herudaan/resumes/${id}`, data),
  deleteResume: (id) => api.delete(`/herudaan/resumes/${id}`),

  // ── Courses ──
  getCourses: (category) => api.get('/herudaan/courses', { params: { category } }),

  // ── Higher Studies ──
  getHigherStudies: (category) => api.get('/herudaan/higher-studies', { params: { category } }),

  // ── Jobs ──
  getJobs: (params) => api.get('/herudaan/jobs', { params }),

  // ── Mentors ──
  getMentors: (params) => api.get('/herudaan/mentors', { params }),
  connectMentor: (data) => api.post('/herudaan/mentors/connect', data),
  getMyConnections: () => api.get('/herudaan/mentors/connections'),

  // ── Community ──
  getPrograms: () => api.get('/herudaan/community/programs'),
  getPosts: (category) => api.get('/herudaan/community/posts', { params: { category } }),
  createPost: (data) => api.post('/herudaan/community/posts', data),
  replyPost: (id, content) => api.post(`/herudaan/community/posts/${id}/reply`, { content }),
  likePost: (id) => api.post(`/herudaan/community/posts/${id}/like`),
};

export default herudaanService;
