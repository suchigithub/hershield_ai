import api from './api';

const heradhikarService = {
  getAgeGroups: () => api.get('/heradhikar/age-groups'),
  getSchemes: (params) => api.get('/heradhikar/schemes', { params }),
  getSchemeDetail: (id) => api.get(`/heradhikar/schemes/${id}`),
  checkEligibility: (data) => api.post('/heradhikar/eligibility', data),
  getInsurance: (type) => api.get('/heradhikar/insurance', { params: { type } }),
  getRights: (category) => api.get('/heradhikar/rights', { params: { category } }),
};

export default heradhikarService;
