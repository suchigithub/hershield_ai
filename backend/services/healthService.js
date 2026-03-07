/**
 * Health Service for HerSwasthya.
 *
 * Provides health tips, nearby clinic directory (mock),
 * telemedicine doctor directory, and symptom info.
 */

// ── Health Tips ─────────────────────────────────
const HEALTH_TIPS = [
  // Nutrition
  { id: 1, category: 'nutrition', title: 'Iron-Rich Foods', tip: 'Include spinach, lentils, and dates in your diet, especially during menstruation, to prevent iron deficiency anemia — a common concern for women.', icon: '🥬' },
  { id: 2, category: 'nutrition', title: 'Calcium Matters', tip: 'Women need 1,000–1,200 mg of calcium daily. Add milk, yogurt, ragi, and sesame seeds to protect bone health and prevent osteoporosis.', icon: '🥛' },
  { id: 3, category: 'nutrition', title: 'Stay Hydrated', tip: 'Drink at least 8 glasses of water daily. Proper hydration helps with digestion, skin health, and reducing fatigue.', icon: '💧' },
  { id: 4, category: 'nutrition', title: 'Folate for All Ages', tip: 'Folic acid isn\'t just for pregnancy. It supports cell regeneration, heart health, and mood regulation. Eat leafy greens, beans, and citrus.', icon: '🥗' },

  // Fitness
  { id: 5, category: 'fitness', title: '30 Minutes Daily', tip: 'Just 30 minutes of brisk walking, yoga, or dancing daily can reduce the risk of heart disease, diabetes, and depression significantly.', icon: '🚶‍♀️' },
  { id: 6, category: 'fitness', title: 'Strength Training', tip: 'Women lose muscle mass faster after 30. Include bodyweight exercises or light weights 2–3 times a week to stay strong and prevent injuries.', icon: '💪' },
  { id: 7, category: 'fitness', title: 'Yoga for Cramps', tip: 'Gentle yoga poses like Child\'s Pose, Cat-Cow, and Supine Twist can relieve menstrual cramps naturally without medication.', icon: '🧘' },

  // Menstrual Health
  { id: 8, category: 'menstrual', title: 'Know Your Cycle', tip: 'A normal menstrual cycle is 21–35 days. Track your periods to understand your body and catch irregularities early.', icon: '📅' },
  { id: 9, category: 'menstrual', title: 'Period Pain Is Normal, But...', tip: 'Mild cramps are common, but severe pain that disrupts daily life may indicate endometriosis or fibroids. Don\'t hesitate to consult a doctor.', icon: '⚠️' },
  { id: 10, category: 'menstrual', title: 'PMS Management', tip: 'Reduce PMS symptoms with magnesium-rich foods (bananas, dark chocolate), regular exercise, and adequate sleep during the luteal phase.', icon: '🌙' },

  // Mental Wellbeing
  { id: 11, category: 'mental', title: 'Sleep Is Medicine', tip: 'Women need 7–9 hours of quality sleep. Poor sleep increases cortisol, weight gain, and mood disorders. Prioritize your rest.', icon: '😴' },
  { id: 12, category: 'mental', title: 'It\'s OK to Not Be OK', tip: 'One in five women experience a mental health condition. Seeking help is strength, not weakness. Talk to someone you trust.', icon: '💜' },
  { id: 13, category: 'mental', title: 'Digital Detox', tip: 'Spending 30 minutes less on social media daily can reduce anxiety and improve self-esteem. Try replacing it with a walk or journaling.', icon: '📵' },

  // Lifestyle
  { id: 14, category: 'lifestyle', title: 'Regular Health Checkups', tip: 'Schedule an annual health checkup including blood work, Pap smear (after 21), and breast examination. Early detection saves lives.', icon: '🩺' },
  { id: 15, category: 'lifestyle', title: 'Sun Protection', tip: 'Apply SPF 30+ sunscreen daily, even on cloudy days. UV damage is cumulative and a leading cause of premature skin aging and skin cancer.', icon: '☀️' },
  { id: 16, category: 'lifestyle', title: 'Gut Health', tip: 'A healthy gut impacts immunity, mood, and weight. Include probiotics (yogurt, fermented foods) and fiber-rich foods in your daily diet.', icon: '🫃' },
];

// ── Nearby Clinics (Mock Directory) ─────────────
const CLINICS = [
  { id: 'c1', name: 'Shanti Women\'s Hospital', type: 'Hospital', speciality: 'Gynecology & Obstetrics', address: 'MG Road, Sector 15, Delhi', phone: '+91-11-2345-6789', rating: 4.7, open: true, timings: '8 AM – 8 PM', distance: '1.2 km' },
  { id: 'c2', name: 'Asha Family Clinic', type: 'Clinic', speciality: 'General & Women\'s Health', address: 'Near City Mall, Andheri West, Mumbai', phone: '+91-22-3456-7890', rating: 4.5, open: true, timings: '9 AM – 6 PM', distance: '2.5 km' },
  { id: 'c3', name: 'Saheli Diagnostic Center', type: 'Diagnostic', speciality: 'Lab Tests & Imaging', address: 'Ring Road, Lajpat Nagar, Delhi', phone: '+91-11-4567-8901', rating: 4.8, open: true, timings: '7 AM – 9 PM', distance: '3.1 km' },
  { id: 'c4', name: 'Nari Seva Health Center', type: 'Government', speciality: 'Primary Healthcare', address: 'Block D, Sarojini Nagar, Delhi', phone: '+91-11-5678-9012', rating: 4.2, open: true, timings: '9 AM – 4 PM', distance: '4.0 km' },
  { id: 'c5', name: 'Dr. Meera\'s Maternity Home', type: 'Maternity', speciality: 'Maternity & Neonatal Care', address: 'Koramangala, Bangalore', phone: '+91-80-6789-0123', rating: 4.9, open: false, timings: '10 AM – 5 PM', distance: '5.3 km' },
  { id: 'c6', name: 'LifeCare Multispeciality', type: 'Hospital', speciality: 'Multispeciality', address: 'Banjara Hills, Hyderabad', phone: '+91-40-7890-1234', rating: 4.6, open: true, timings: '24 hours', distance: '6.8 km' },
];

// ── Telemedicine Doctors ────────────────────────
const DOCTORS = [
  { id: 'd1', name: 'Dr. Anita Desai', speciality: 'Gynecologist', experience: '14 years', languages: ['Hindi', 'English'], fee: 500, rating: 4.8, available: true, nextSlot: '10:00 AM Today' },
  { id: 'd2', name: 'Dr. Sneha Patil', speciality: 'General Physician', experience: '10 years', languages: ['Hindi', 'English', 'Marathi'], fee: 300, rating: 4.7, available: true, nextSlot: '11:30 AM Today' },
  { id: 'd3', name: 'Dr. Rekha Sundaram', speciality: 'Dermatologist', experience: '8 years', languages: ['Tamil', 'English', 'Hindi'], fee: 400, rating: 4.6, available: true, nextSlot: '2:00 PM Today' },
  { id: 'd4', name: 'Dr. Pooja Agarwal', speciality: 'Nutritionist', experience: '6 years', languages: ['Hindi', 'English'], fee: 350, rating: 4.9, available: true, nextSlot: '3:30 PM Today' },
  { id: 'd5', name: 'Dr. Kavitha Nair', speciality: 'Obstetrician', experience: '18 years', languages: ['Malayalam', 'English', 'Hindi'], fee: 600, rating: 4.8, available: false, nextSlot: 'Tomorrow 9:00 AM' },
  { id: 'd6', name: 'Dr. Fatima Khan', speciality: 'Psychiatrist', experience: '11 years', languages: ['Hindi', 'English', 'Urdu'], fee: 700, rating: 4.7, available: true, nextSlot: '4:00 PM Today' },
];

// ── Common Symptoms Reference ───────────────────
const SYMPTOMS = [
  'Cramps', 'Headache', 'Bloating', 'Fatigue', 'Mood swings',
  'Back pain', 'Breast tenderness', 'Nausea', 'Acne', 'Insomnia',
  'Appetite changes', 'Hot flashes', 'Dizziness', 'Heavy flow', 'Light flow',
];

// ── API functions ───────────────────────────────
const getHealthTips = (category = null) => {
  if (category) return HEALTH_TIPS.filter((t) => t.category === category);
  return HEALTH_TIPS;
};

const getNearbyClinics = (filters = {}) => {
  let list = [...CLINICS];
  if (filters.type) list = list.filter((c) => c.type.toLowerCase() === filters.type.toLowerCase());
  if (filters.open === true || filters.open === 'true') list = list.filter((c) => c.open);
  return list;
};

const getDoctors = (filters = {}) => {
  let list = [...DOCTORS];
  if (filters.speciality) list = list.filter((d) => d.speciality.toLowerCase().includes(filters.speciality.toLowerCase()));
  if (filters.available === true || filters.available === 'true') list = list.filter((d) => d.available);
  return list;
};

const getDoctorById = (id) => DOCTORS.find((d) => d.id === id) || null;

module.exports = {
  getHealthTips,
  getNearbyClinics,
  getDoctors,
  getDoctorById,
  SYMPTOMS,
  HEALTH_TIPS,
  CLINICS,
  DOCTORS,
};
