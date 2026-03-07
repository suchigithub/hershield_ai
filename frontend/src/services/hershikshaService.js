import api from './api';

const hershikshaService = {
  getScholarships: (type) => api.get('/hershiksha/scholarships', { params: { type } }),
  getCourses: (category) => api.get('/hershiksha/courses', { params: { category } }),
  getSkillPrograms: () => api.get('/hershiksha/skill-programs'),
  getCertifications: () => api.get('/hershiksha/certifications'),
  getFamilyLearning: () => api.get('/hershiksha/family-learning'),
};

export default hershikshaService;
