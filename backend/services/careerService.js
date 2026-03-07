/**
 * Career Service for HerUdaan.
 * Courses, jobs, mentors, higher studies, and community programs.
 */

const SKILL_COURSES = [
  { id: 'sc1', title: 'Digital Marketing Fundamentals', provider: 'Google', category: 'marketing', duration: '40 hours', level: 'Beginner', free: true, certificate: true, url: '#', description: 'Learn SEO, SEM, social media marketing, and analytics from Google experts.' },
  { id: 'sc2', title: 'Full-Stack Web Development', provider: 'freeCodeCamp', category: 'tech', duration: '300 hours', level: 'Beginner–Intermediate', free: true, certificate: true, url: '#', description: 'HTML, CSS, JavaScript, React, Node.js — everything to become a web developer.' },
  { id: 'sc3', title: 'Data Analytics with Python', provider: 'Coursera (IBM)', category: 'tech', duration: '60 hours', level: 'Beginner', free: false, certificate: true, url: '#', description: 'Python, Pandas, SQL, and data visualization for aspiring data analysts.' },
  { id: 'sc4', title: 'Financial Accounting Basics', provider: 'Khan Academy', category: 'finance', duration: '20 hours', level: 'Beginner', free: true, certificate: false, url: '#', description: 'Understand balance sheets, income statements, and basic accounting principles.' },
  { id: 'sc5', title: 'Communication & Soft Skills', provider: 'LinkedIn Learning', category: 'softskills', duration: '15 hours', level: 'All levels', free: false, certificate: true, url: '#', description: 'Build confidence in communication, leadership, teamwork, and negotiation.' },
  { id: 'sc6', title: 'Graphic Design with Canva', provider: 'Canva Academy', category: 'design', duration: '10 hours', level: 'Beginner', free: true, certificate: true, url: '#', description: 'Create stunning designs for social media, presentations, and marketing materials.' },
  { id: 'sc7', title: 'Tally & GST Certification', provider: 'Tally Education', category: 'finance', duration: '30 hours', level: 'Beginner', free: false, certificate: true, url: '#', description: 'Master Tally ERP 9, GST filing, and become job-ready for accounting roles.' },
  { id: 'sc8', title: 'Spoken English & IELTS Prep', provider: 'British Council', category: 'language', duration: '40 hours', level: 'Intermediate', free: false, certificate: true, url: '#', description: 'Improve fluency, grammar, and prepare for IELTS with structured lessons.' },
  { id: 'sc9', title: 'Content Writing Masterclass', provider: 'Udemy', category: 'writing', duration: '12 hours', level: 'Beginner', free: false, certificate: true, url: '#', description: 'Learn blog writing, copywriting, and SEO content creation for freelancing or employment.' },
  { id: 'sc10', title: 'Project Management (PMP Basics)', provider: 'PMI', category: 'management', duration: '35 hours', level: 'Intermediate', free: false, certificate: true, url: '#', description: 'Understand project lifecycle, Agile, Scrum, and prepare for PMP certification.' },
];

const JOB_LISTINGS = [
  { id: 'j1', title: 'Content Writer', company: 'TechBlog India', type: 'Full-time', location: 'Remote', salary: '₹3–5 LPA', category: 'writing', returnFriendly: true, experience: '0–2 years', posted: '2 days ago', description: 'Write engaging blog posts, social media content, and website copy. Perfect for women restarting careers.' },
  { id: 'j2', title: 'Customer Support Executive', company: 'Flipkart', type: 'Full-time', location: 'Bangalore', salary: '₹2.5–4 LPA', category: 'support', returnFriendly: true, experience: '0–3 years', posted: '1 day ago', description: 'Handle customer queries via chat, email, and phone. Training provided.' },
  { id: 'j3', title: 'Junior Data Analyst', company: 'Infosys BPM', type: 'Full-time', location: 'Hybrid – Pune', salary: '₹4–6 LPA', category: 'tech', returnFriendly: true, experience: '1–3 years', posted: '3 days ago', description: 'Analyze business data, create dashboards, and generate insights. SQL and Excel required.' },
  { id: 'j4', title: 'Freelance Graphic Designer', company: 'DesignHub', type: 'Freelance', location: 'Remote', salary: '₹15K–30K/month', category: 'design', returnFriendly: true, experience: '1+ years', posted: '5 days ago', description: 'Create social media creatives, branding materials, and presentations for clients.' },
  { id: 'j5', title: 'Teaching Assistant (Online)', company: 'BYJU\'S', type: 'Part-time', location: 'Remote', salary: '₹12K–18K/month', category: 'education', returnFriendly: true, experience: '0–2 years', posted: '1 day ago', description: 'Assist students in K-12 subjects online. Flexible hours, perfect for mothers.' },
  { id: 'j6', title: 'HR Executive', company: 'Grow Women Corp', type: 'Full-time', location: 'Delhi NCR', salary: '₹3.5–5.5 LPA', category: 'hr', returnFriendly: true, experience: '2–5 years', posted: '4 days ago', description: 'Manage recruitment, onboarding, and employee engagement. Career returners encouraged.' },
  { id: 'j7', title: 'Social Media Manager', company: 'StartupXYZ', type: 'Full-time', location: 'Remote', salary: '₹4–7 LPA', category: 'marketing', returnFriendly: true, experience: '1–4 years', posted: '2 days ago', description: 'Plan and execute social media strategy, create content calendars, and manage campaigns.' },
  { id: 'j8', title: 'Accounting Intern', company: 'Deloitte India', type: 'Internship', location: 'Mumbai', salary: '₹15K/month stipend', category: 'finance', returnFriendly: false, experience: 'Freshers', posted: '1 week ago', description: '3-month internship in audit and advisory. Tally knowledge preferred.' },
];

const MENTORS = [
  { id: 'm1', name: 'Sunita Krishnan', title: 'VP Engineering @ Microsoft', speciality: 'Tech Career & Leadership', experience: '20 years', languages: ['Hindi', 'English'], available: true, bio: 'Restarted her career after a 5-year break. Now helps women break into tech leadership.', rating: 4.9 },
  { id: 'm2', name: 'Deepa Nair', title: 'Founder, WomenInBiz', speciality: 'Entrepreneurship & Startups', experience: '15 years', languages: ['English', 'Malayalam', 'Hindi'], available: true, bio: 'Serial entrepreneur who mentors women starting businesses from scratch.', rating: 4.8 },
  { id: 'm3', name: 'Anita Reddy', title: 'Senior Manager @ Deloitte', speciality: 'Finance & Consulting', experience: '12 years', languages: ['Telugu', 'English', 'Hindi'], available: true, bio: 'Chartered Accountant who guides women into consulting and finance careers.', rating: 4.7 },
  { id: 'm4', name: 'Prerna Gupta', title: 'Content Director @ Zomato', speciality: 'Content, Writing & Marketing', experience: '10 years', languages: ['Hindi', 'English'], available: true, bio: 'From freelance writer to content director. Helps women build writing careers.', rating: 4.8 },
  { id: 'm5', name: 'Kavita Sharma', title: 'Head of HR @ TCS', speciality: 'HR, Resume & Interview Prep', experience: '18 years', languages: ['Hindi', 'English', 'Punjabi'], available: true, bio: 'Has reviewed 10,000+ resumes. Expert in interview preparation for career returnees.', rating: 4.9 },
  { id: 'm6', name: 'Meghna Sen', title: 'Data Scientist @ Google', speciality: 'Data Science & AI', experience: '8 years', languages: ['Bengali', 'English', 'Hindi'], available: false, bio: 'Transitioned from biology to data science. Mentors women entering STEM.', rating: 4.6 },
];

const HIGHER_STUDIES = [
  { id: 'hs1', title: 'MBA (Online)', institution: 'IIM Bangalore', duration: '2 years', mode: 'Online', fee: '₹6–12 lakhs', eligibility: 'Graduation + Work Experience', description: 'Prestigious MBA for working professionals. Flexible schedule for career returners.', category: 'management' },
  { id: 'hs2', title: 'PG Diploma in Data Science', institution: 'IIIT Bangalore (upGrad)', duration: '12 months', mode: 'Online', fee: '₹2.5 lakhs', eligibility: 'Graduation (any stream)', description: 'Industry-ready data science program with Python, ML, and real projects.', category: 'tech' },
  { id: 'hs3', title: 'B.Ed (Distance)', institution: 'IGNOU', duration: '2 years', mode: 'Distance', fee: '₹50,000', eligibility: 'Graduation (50%)', description: 'Become a certified teacher. Ideal for women wanting to enter education.', category: 'education' },
  { id: 'hs4', title: 'Certified Financial Planner (CFP)', institution: 'FPSB India', duration: '6 months', mode: 'Online/Offline', fee: '₹30,000', eligibility: 'Graduation', description: 'Globally recognized certification for financial planning and advisory careers.', category: 'finance' },
  { id: 'hs5', title: 'UX/UI Design Certification', institution: 'Google (Coursera)', duration: '6 months', mode: 'Online', fee: '₹3,000/month', eligibility: 'No prerequisites', description: 'Learn user research, wireframing, prototyping, and usability testing.', category: 'design' },
  { id: 'hs6', title: 'MA in English / Journalism', institution: 'Delhi University (SOL)', duration: '2 years', mode: 'Distance', fee: '₹15,000/year', eligibility: 'Graduation', description: 'Strengthen writing skills and open doors to media, PR, and publishing careers.', category: 'writing' },
];

const COMMUNITY_PROGRAMS = [
  { id: 'cp1', title: 'Back-to-Work Bootcamp', type: 'Cohort', duration: '6 weeks', description: 'Structured program for women returning after a career break. Covers resume, interview prep, and confidence building.', startDate: '2026-04-01' },
  { id: 'cp2', title: 'Women in Tech Circle', type: 'Learning Circle', duration: 'Ongoing', description: 'Weekly meetups to learn coding, share projects, and support each other in tech careers.', startDate: 'Every Saturday' },
  { id: 'cp3', title: 'Entrepreneurship Launchpad', type: 'Cohort', duration: '8 weeks', description: 'From idea to MVP. Build your business plan, learn marketing, and get mentor support.', startDate: '2026-05-15' },
  { id: 'cp4', title: 'Resume & Interview Workshop', type: 'Workshop', duration: '2 hours', description: 'Live workshop with HR experts. Get your resume reviewed and practice mock interviews.', startDate: 'Every 2nd Tuesday' },
  { id: 'cp5', title: 'Financial Independence Club', type: 'Learning Circle', duration: 'Ongoing', description: 'Learn investing, tax planning, and financial independence strategies together.', startDate: 'Every Wednesday' },
];

const getCourses = (category) => category ? SKILL_COURSES.filter((c) => c.category === category) : SKILL_COURSES;
const getJobs = (filters = {}) => {
  let list = [...JOB_LISTINGS];
  if (filters.category) list = list.filter((j) => j.category === filters.category);
  if (filters.type) list = list.filter((j) => j.type.toLowerCase() === filters.type.toLowerCase());
  if (filters.remote) list = list.filter((j) => j.location.toLowerCase().includes('remote'));
  if (filters.returnFriendly) list = list.filter((j) => j.returnFriendly);
  return list;
};
const getMentors = (filters = {}) => {
  let list = [...MENTORS];
  if (filters.speciality) list = list.filter((m) => m.speciality.toLowerCase().includes(filters.speciality.toLowerCase()));
  if (filters.available) list = list.filter((m) => m.available);
  return list;
};
const getMentorById = (id) => MENTORS.find((m) => m.id === id) || null;
const getHigherStudies = (category) => category ? HIGHER_STUDIES.filter((h) => h.category === category) : HIGHER_STUDIES;
const getCommunityPrograms = () => COMMUNITY_PROGRAMS;

module.exports = { getCourses, getJobs, getMentors, getMentorById, getHigherStudies, getCommunityPrograms, SKILL_COURSES, JOB_LISTINGS, MENTORS, HIGHER_STUDIES, COMMUNITY_PROGRAMS };
