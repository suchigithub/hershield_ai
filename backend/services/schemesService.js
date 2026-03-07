/**
 * Government Schemes, Rights & Insurance Service for HerAdhikar.
 * Age-wise schemes (0–99), eligibility checking, application guidance, and insurance info.
 */

// ── Age-Wise Scheme Groups ──────────────────────
const AGE_GROUPS = [
  { id: 'ag1', range: '0–5 years', label: 'Early Childhood', icon: '👶', description: 'Child welfare, nutrition, immunization, and maternal support for the youngest.' },
  { id: 'ag2', range: '6–14 years', label: 'School Age', icon: '📚', description: 'Education, scholarships, and child protection programs.' },
  { id: 'ag3', range: '15–24 years', label: 'Youth', icon: '🎓', description: 'Skill development, higher education, and youth empowerment.' },
  { id: 'ag4', range: '25–40 years', label: 'Working Age', icon: '💼', description: 'Employment, entrepreneurship, maternity, and housing support.' },
  { id: 'ag5', range: '41–59 years', label: 'Mid-Life', icon: '🏠', description: 'Financial security, health support, and livelihood programs.' },
  { id: 'ag6', range: '60+ years', label: 'Senior Citizens', icon: '🧓', description: 'Pension, senior citizen welfare, healthcare, and social security.' },
];

// ── Government Schemes Database ─────────────────
const SCHEMES = [
  // 0–5 years
  { id: 's1', name: 'Integrated Child Development Services (ICDS)', ageGroup: '0–5', category: 'nutrition', type: 'Central', description: 'Provides supplementary nutrition, immunization, health checkups, and pre-school education for children under 6 and pregnant/lactating mothers.', eligibility: 'All children under 6 years and pregnant/nursing women', benefits: 'Free nutrition, immunization, health monitoring, and pre-school education at Anganwadi centers', documents: ['Birth certificate', 'Aadhaar card (mother/child)', 'Anganwadi registration'], howToApply: 'Visit your nearest Anganwadi center and register. No online application needed.', portal: 'https://icds-wcd.nic.in', important: true },
  { id: 's2', name: 'Janani Suraksha Yojana (JSY)', ageGroup: '0–5', category: 'health', type: 'Central', description: 'Cash assistance to pregnant women for institutional delivery to reduce maternal and infant mortality.', eligibility: 'Pregnant women from BPL families, age 19+, up to 2 live births', benefits: '₹1,400 (rural) / ₹1,000 (urban) cash assistance for hospital delivery', documents: ['Aadhaar card', 'BPL card', 'Bank account details', 'MCH card'], howToApply: 'Register at your nearest government hospital or PHC during pregnancy. ASHA workers can help.', portal: 'https://nhm.gov.in', important: true },
  { id: 's3', name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)', ageGroup: '0–5', category: 'maternity', type: 'Central', description: 'Maternity benefit of ₹5,000 in installments for first live birth to compensate wage loss.', eligibility: 'Pregnant women (first child), age 19+', benefits: '₹5,000 in 3 installments (₹1,000 + ₹2,000 + ₹2,000)', documents: ['Aadhaar card', 'Bank passbook', 'MCH card', 'Marriage certificate'], howToApply: 'Register at Anganwadi center or through the PMMVY portal. Forms available at health centers.', portal: 'https://pmmvy.wcd.gov.in', important: true },

  // 6–14 years
  { id: 's4', name: 'Right to Education (RTE)', ageGroup: '6–14', category: 'education', type: 'Central', description: 'Guarantees free and compulsory education for all children aged 6–14 in neighborhood schools.', eligibility: 'All children aged 6–14 years', benefits: 'Free education, textbooks, uniforms, and mid-day meals in government schools. 25% reservation in private schools for weaker sections.', documents: ['Birth certificate', 'Address proof', 'Income certificate (for private school admission)', 'Caste certificate (if applicable)'], howToApply: 'Apply through state RTE portal or directly at schools during admission season.', portal: 'https://rte.education.gov.in', important: true },
  { id: 's5', name: 'National Scheme for Incentive to Girls (NSIGSE)', ageGroup: '6–14', category: 'education', type: 'Central', description: 'Fixed deposit of ₹3,000 for SC/ST girls enrolled in class 1 to promote education.', eligibility: 'SC/ST girls enrolled in class 1 in government or aided schools', benefits: '₹3,000 fixed deposit, withdrawable after passing class 8 with interest', documents: ['Caste certificate', 'School enrollment proof', 'Bank account'], howToApply: 'Through school headmaster. Schools nominate eligible girls.', portal: 'https://education.gov.in', important: false },
  { id: 's6', name: 'Beti Bachao Beti Padhao', ageGroup: '6–14', category: 'education', type: 'Central', description: 'Campaign to promote survival, protection, and education of the girl child.', eligibility: 'All girl children', benefits: 'Awareness campaigns, community engagement, increased school enrollment, and protection services', documents: ['None for awareness. Related scheme benefits may need Aadhaar, birth certificate.'], howToApply: 'Participate through local Anganwadi, schools, and district administration.', portal: 'https://wcd.nic.in/bbbp-schemes', important: true },

  // 15–24 years
  { id: 's7', name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)', ageGroup: '15–24', category: 'skills', type: 'Central', description: 'Free skill training and certification in 200+ job roles to improve employability.', eligibility: 'Youth aged 15–45 (Indian citizens), dropouts and unemployed preferred', benefits: 'Free training (150–300 hours), industry-recognized certificate, placement support, ₹8,000 reward on certification', documents: ['Aadhaar card', 'Bank account', 'Education certificates'], howToApply: 'Register at https://pmkvyofficial.org or visit nearest PMKVY training center.', portal: 'https://pmkvyofficial.org', important: true },
  { id: 's8', name: 'Sukanya Samriddhi Yojana', ageGroup: '15–24', category: 'finance', type: 'Central', description: 'High-interest savings account for girl children. Matures at age 21.', eligibility: 'Girls under 10 years (opened by parents). Withdrawal for education at 18+.', benefits: '8.2% interest (highest among small savings), tax-free returns, partial withdrawal for higher education at 18+', documents: ['Birth certificate (girl)', 'Parent Aadhaar & PAN', 'Address proof'], howToApply: 'Open account at any post office or authorized bank. Minimum deposit ₹250/year.', portal: 'https://www.india.gov.in/sukanya-samriddhi-yojana', important: true },
  { id: 's9', name: 'Post-Matric Scholarship for Girls', ageGroup: '15–24', category: 'education', type: 'Central/State', description: 'Financial support for SC/ST/OBC girls pursuing higher education (class 11 to PhD).', eligibility: 'Girls from SC/ST/OBC families, family income below ₹2.5 lakhs/year', benefits: 'Tuition fees, maintenance allowance, book grants', documents: ['Caste certificate', 'Income certificate', 'Previous marksheet', 'Bank account'], howToApply: 'Apply through National Scholarship Portal (NSP) during July–October.', portal: 'https://scholarships.gov.in', important: true },

  // 25–40 years
  { id: 's10', name: 'Pradhan Mantri Mudra Yojana (PMMY)', ageGroup: '25–40', category: 'entrepreneurship', type: 'Central', description: 'Collateral-free loans up to ₹10 lakhs for starting or expanding a small business.', eligibility: 'Any Indian citizen with a business plan, non-corporate/non-farm sector', benefits: 'Shishu (up to ₹50K), Kishore (₹50K–5L), Tarun (₹5L–10L) — no collateral needed', documents: ['Aadhaar card', 'PAN card', 'Business plan', 'Address proof', 'Passport photos'], howToApply: 'Apply at any bank branch, NBFC, or through https://mudra.org.in', portal: 'https://mudra.org.in', important: true },
  { id: 's11', name: 'Pradhan Mantri Awas Yojana (PMAY)', ageGroup: '25–40', category: 'housing', type: 'Central', description: 'Affordable housing with interest subsidy for first-time home buyers from lower income groups.', eligibility: 'EWS/LIG/MIG families without a pucca house. Women ownership/co-ownership mandatory.', benefits: 'Interest subsidy of 3–6.5% on home loans, up to ₹2.67 lakh benefit', documents: ['Aadhaar card', 'Income proof', 'Property documents', 'LIG/EWS certificate'], howToApply: 'Apply through PMAY portal or Common Service Centers (CSC).', portal: 'https://pmaymis.gov.in', important: true },
  { id: 's12', name: 'Maternity Benefit Act', ageGroup: '25–40', category: 'maternity', type: 'Central', description: 'Paid maternity leave of 26 weeks for working women in organized sector.', eligibility: 'Women employees with 80+ days of work in preceding 12 months', benefits: '26 weeks paid leave (first 2 children), 12 weeks (3rd child), crèche facility', documents: ['Employment proof', 'Medical certificate', 'Expected date of delivery'], howToApply: 'Apply through employer HR department. Rights automatically applicable.', portal: 'https://labour.gov.in', important: true },

  // 41–59 years
  { id: 's13', name: 'Atal Pension Yojana (APY)', ageGroup: '41–59', category: 'pension', type: 'Central', description: 'Guaranteed pension of ₹1,000–5,000/month after age 60 for unorganized sector workers.', eligibility: 'Indian citizens aged 18–40 with a bank account', benefits: 'Fixed monthly pension (₹1K–5K) after 60, spouse gets same pension after death', documents: ['Aadhaar card', 'Bank account', 'Mobile number'], howToApply: 'Enroll through any bank branch or net banking. Auto-debit from savings account.', portal: 'https://npscra.nsdl.co.in/scheme-details.php', important: true },
  { id: 's14', name: 'Stand-Up India', ageGroup: '41–59', category: 'entrepreneurship', type: 'Central', description: 'Bank loans of ₹10 lakh to ₹1 crore for SC/ST and women entrepreneurs.', eligibility: 'Women or SC/ST entrepreneurs, 18+ years, for greenfield enterprises', benefits: 'Composite loan ₹10L–1Cr, repayment up to 7 years, 25% margin money', documents: ['Aadhaar/PAN', 'Business plan', 'Caste certificate (SC/ST)', 'Address proof'], howToApply: 'Apply through https://standupmitra.in or at any scheduled bank.', portal: 'https://standupmitra.in', important: true },

  // 60+ years
  { id: 's15', name: 'Indira Gandhi National Old Age Pension (IGNOAPS)', ageGroup: '60+', category: 'pension', type: 'Central', description: 'Monthly pension for senior citizens from BPL families.', eligibility: 'Indian citizens 60+ years, BPL family', benefits: '₹200/month (60–79 years), ₹500/month (80+ years) from Central Govt + state top-up', documents: ['Age proof', 'BPL card', 'Aadhaar card', 'Bank account'], howToApply: 'Apply at Block/District office or through state pension portal.', portal: 'https://nsap.nic.in', important: true },
  { id: 's16', name: 'Ayushman Bharat (PM-JAY)', ageGroup: '60+', category: 'health', type: 'Central', description: 'Free health insurance of ₹5 lakh/year per family for hospitalization.', eligibility: 'Families listed in SECC-2011 database (bottom 40%)', benefits: '₹5 lakh/year cashless treatment at empanelled hospitals, 1,500+ procedures covered', documents: ['Aadhaar card', 'Ration card', 'SECC inclusion letter'], howToApply: 'Check eligibility at https://mera.pmjay.gov.in. Get e-card at nearest CSC or empanelled hospital.', portal: 'https://pmjay.gov.in', important: true },
  { id: 's17', name: 'Rashtriya Vayoshri Yojana (RVY)', ageGroup: '60+', category: 'health', type: 'Central', description: 'Free physical aids and assistive devices for senior citizens from BPL families.', eligibility: 'BPL senior citizens (60+) with age-related disabilities', benefits: 'Free walking sticks, hearing aids, spectacles, wheelchairs, dentures', documents: ['Age proof', 'BPL certificate', 'Disability certificate'], howToApply: 'Through district assessment camps. Check with District Social Welfare Officer.', portal: 'https://socialjustice.gov.in', important: false },
];

// ── Insurance Schemes ───────────────────────────
const INSURANCE_SCHEMES = [
  { id: 'ins1', name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)', type: 'Life Insurance', premium: '₹436/year', coverage: '₹2 lakhs life cover', eligibility: 'Age 18–50, savings bank account', enrollment: 'Auto-debit from bank account. Enroll/renew before June 1 each year.', description: 'Low-cost life insurance. ₹2 lakh payment to nominee on death from any cause.', renewal: 'Annual renewal by May 31 each year' },
  { id: 'ins2', name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)', type: 'Accident Insurance', premium: '₹20/year', coverage: '₹2 lakhs (death), ₹1 lakh (partial disability)', eligibility: 'Age 18–70, savings bank account', enrollment: 'Auto-debit from bank account. Enroll/renew before June 1.', description: 'Cheapest accident insurance in the world. Covers accidental death & disability.', renewal: 'Annual renewal by May 31' },
  { id: 'ins3', name: 'Ayushman Bharat (PM-JAY)', type: 'Health Insurance', premium: 'FREE', coverage: '₹5 lakhs/year per family', eligibility: 'Families in SECC-2011 list (bottom 40%)', enrollment: 'Check at mera.pmjay.gov.in. Get e-card at CSC or empanelled hospital.', description: 'Cashless hospitalization cover. 1,500+ procedures at 20,000+ hospitals.', renewal: 'No renewal — continuous coverage for eligible families' },
  { id: 'ins4', name: 'Janashree Bima Yojana', type: 'Life + Accident', premium: '₹200/year (50% Govt subsidy)', coverage: '₹30,000 (natural death), ₹75,000 (accident)', eligibility: 'Rural/urban poor aged 18–59, BPL or near-BPL', enrollment: 'Through LIC agents or nodal agencies.', description: 'Combined life and accident cover with scholarship benefit for children.', renewal: 'Annual' },
  { id: 'ins5', name: 'Pradhan Mantri Jan Arogya Yojana – Maternal Cover', type: 'Maternity Insurance', premium: 'FREE (under PM-JAY)', coverage: 'Full maternity hospitalization', eligibility: 'PM-JAY eligible families', enrollment: 'Automatic for PM-JAY card holders.', description: 'Covers normal delivery, C-section, pre/post-natal care at empanelled hospitals.', renewal: 'Continuous' },
];

// ── Rights Reference ────────────────────────────
const RIGHTS = [
  { id: 'r1', title: 'Right to Equal Pay', law: 'Equal Remuneration Act, 1976', description: 'Women must receive equal pay for the same work or work of similar nature. Any discrimination in recruitment or pay is illegal.', category: 'employment' },
  { id: 'r2', title: 'Right Against Workplace Harassment', law: 'Sexual Harassment of Women at Workplace Act, 2013 (POSH)', description: 'Every workplace with 10+ employees must have an Internal Complaints Committee. Aggrieved women can file complaints for investigation.', category: 'safety' },
  { id: 'r3', title: 'Right to Maternity Leave', law: 'Maternity Benefit Act, 2017', description: '26 weeks paid maternity leave for the first two children. 12 weeks for third child. Crèche facility mandatory for 50+ employees.', category: 'maternity' },
  { id: 'r4', title: 'Right to Property', law: 'Hindu Succession Act (Amendment), 2005', description: 'Daughters have equal coparcenary rights as sons in ancestral property. This applies to all Hindu, Sikh, Buddhist, and Jain women.', category: 'property' },
  { id: 'r5', title: 'Right Against Domestic Violence', law: 'Protection of Women from Domestic Violence Act, 2005', description: 'Covers physical, emotional, sexual, verbal, and economic abuse. Women can seek protection orders, residence orders, and monetary relief.', category: 'safety' },
  { id: 'r6', title: 'Right to Free Legal Aid', law: 'Legal Services Authorities Act, 1987', description: 'Every woman (regardless of income) is entitled to free legal aid. Contact your District Legal Services Authority.', category: 'legal' },
  { id: 'r7', title: 'Right to Education', law: 'Right of Children to Free and Compulsory Education Act, 2009', description: 'Free and compulsory education for all children aged 6–14. 25% seats in private schools reserved for weaker sections.', category: 'education' },
  { id: 'r8', title: 'Right to Dignified Healthcare', law: 'Multiple Acts & Supreme Court Rulings', description: 'No hospital can refuse emergency treatment. Pregnant women cannot be denied admission. Police facilitation is mandatory for medico-legal cases.', category: 'health' },
];

// ── API Functions ────────────────────────────────
const getAgeGroups = () => AGE_GROUPS;

const getSchemes = (filters = {}) => {
  let list = [...SCHEMES];
  if (filters.ageGroup) list = list.filter((s) => s.ageGroup === filters.ageGroup);
  if (filters.category) list = list.filter((s) => s.category === filters.category);
  if (filters.type) list = list.filter((s) => s.type.toLowerCase().includes(filters.type.toLowerCase()));
  return list;
};

const getSchemeById = (id) => SCHEMES.find((s) => s.id === id) || null;

const checkEligibility = ({ age, income, caste, location }) => {
  const userAge = Number(age) || 0;
  const eligible = [];

  SCHEMES.forEach((s) => {
    const [min, max] = s.ageGroup.replace('+', '–999').split('–').map(Number);
    if (userAge >= min && userAge <= (max || 999)) {
      let matchLevel = 'possibly eligible';
      if (s.eligibility.toLowerCase().includes('all')) matchLevel = 'eligible';
      if (income && s.eligibility.toLowerCase().includes('bpl') && income > 100000) matchLevel = 'not eligible';
      if (caste && s.eligibility.toLowerCase().includes('sc/st') && !['sc', 'st'].includes(caste.toLowerCase())) matchLevel = 'not eligible';
      if (matchLevel !== 'not eligible') {
        eligible.push({ scheme: s, matchLevel, reason: `Age ${userAge} falls in ${s.ageGroup} range.` });
      }
    }
  });
  return eligible;
};

const getInsurance = (type) => {
  if (type) return INSURANCE_SCHEMES.filter((i) => i.type.toLowerCase().includes(type.toLowerCase()));
  return INSURANCE_SCHEMES;
};

const getRights = (category) => {
  if (category) return RIGHTS.filter((r) => r.category === category);
  return RIGHTS;
};

module.exports = { getAgeGroups, getSchemes, getSchemeById, checkEligibility, getInsurance, getRights, AGE_GROUPS, SCHEMES, INSURANCE_SCHEMES, RIGHTS };
