#!/usr/bin/env node
/**
 * HERSHIELD MCP Server
 *
 * Exposes HERSHIELD app tools via Model Context Protocol so AI assistants
 * (Copilot, Claude, etc.) can interact with safety, health, finance,
 * education, career, rights, and wellness features.
 */

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');

// ── Load services ─────────────────────────────
const { generateOTP } = require('./services/otpService');
const { getHealthTips, getNearbyClinics, getDoctors } = require('./services/healthService');
const { getMeditations, getTherapists, getReflectionPrompt, getRandomAffirmation } = require('./services/wellnessService');
const { getWorkouts, getCoaches } = require('./services/workoutService');
const { getCourses: getSkillCourses, getJobs, getMentors, getHigherStudies, getCommunityPrograms } = require('./services/careerService');
const { getScholarships, getCourses: getEduCourses, getSkillPrograms, getCertifications, getFamilyLearning } = require('./services/educationService');
const { getAgeGroups, getSchemes, checkEligibility, getInsurance, getRights } = require('./services/schemesService');
const { generateUPILink, getFinanceTips } = require('./services/upiService');

// ── Create MCP Server ─────────────────────────
const server = new McpServer({
  name: 'HERSHIELD',
  version: '1.0.0',
  description: 'HERSHIELD — Women Empowerment Platform. Safety, Health, Finance, Education, Career, Rights & Wellness tools.',
});

// ════════════════════════════════════════════════
// 🛡️ HerSuraksha — Safety
// ════════════════════════════════════════════════

server.tool(
  'sos_alert',
  'Trigger an SOS safety alert with location. Returns emergency contacts and safety instructions.',
  { latitude: z.number().optional().describe('GPS latitude'), longitude: z.number().optional().describe('GPS longitude') },
  async ({ latitude, longitude }) => {
    const location = latitude && longitude
      ? `📍 Location: ${latitude}, ${longitude}\nGoogle Maps: https://maps.google.com/?q=${latitude},${longitude}`
      : '📍 Location not available. Please share your GPS location.';
    return {
      content: [{
        type: 'text',
        text: `🚨 SOS ALERT TRIGGERED!\n\n${location}\n\n📞 Emergency Contacts:\n• Police: 112\n• Women Helpline: 181\n• Ambulance: 108\n• Child Helpline: 1098\n\n⚠️ Stay calm. Help is on the way.\nShare your live location with trusted contacts immediately.`
      }]
    };
  }
);

// ════════════════════════════════════════════════
// ❤️ HerSwasthya — Health
// ════════════════════════════════════════════════

server.tool(
  'health_tips',
  'Get health tips for women. Categories: nutrition, fitness, menstrual, mental, lifestyle.',
  { category: z.string().optional().describe('Filter by category') },
  async ({ category }) => {
    const tips = getHealthTips(category);
    const text = tips.map(t => `${t.icon} **${t.title}**\n${t.tip}`).join('\n\n');
    return { content: [{ type: 'text', text: `💊 Health Tips${category ? ` (${category})` : ''}:\n\n${text}` }] };
  }
);

server.tool(
  'find_clinics',
  'Find nearby clinics, hospitals, and healthcare centers.',
  { type: z.string().optional().describe('Clinic type: Hospital, Clinic, Diagnostic, Government, Maternity'), open: z.boolean().optional().describe('Only show open clinics') },
  async ({ type, open }) => {
    const clinics = getNearbyClinics({ type, open });
    const text = clinics.map(c => `🏥 **${c.name}** (${c.type})\n📍 ${c.address}\n📞 ${c.phone}\n⭐ ${c.rating} · ${c.timings} · ${c.distance}`).join('\n\n');
    return { content: [{ type: 'text', text: `🏥 Nearby Clinics:\n\n${text}` }] };
  }
);

server.tool(
  'find_doctors',
  'Find doctors for telemedicine consultations.',
  { speciality: z.string().optional().describe('Doctor speciality') },
  async ({ speciality }) => {
    const doctors = getDoctors({ speciality, available: true });
    const text = doctors.map(d => `👩‍⚕️ **${d.name}** — ${d.speciality}\n${d.experience} · ₹${d.fee} · ⭐ ${d.rating}\nNext: ${d.nextSlot} · Languages: ${d.languages.join(', ')}`).join('\n\n');
    return { content: [{ type: 'text', text: `📱 Available Doctors:\n\n${text}` }] };
  }
);

server.tool(
  'get_workouts',
  'Get workout routines for women. Categories: yoga, hiit, strength, cardio, period-friendly.',
  { category: z.string().optional().describe('Workout category') },
  async ({ category }) => {
    const workouts = getWorkouts(category);
    const text = workouts.map(w => `💪 **${w.title}** (${w.category})\n${w.description}\n⏱ ${w.durationMin} min · 🔥 ${w.caloriesBurned} cal · Level: ${w.difficulty}\nExercises: ${w.exercises.map(e => e.name).join(', ')}`).join('\n\n');
    return { content: [{ type: 'text', text: `💪 Workouts:\n\n${text}` }] };
  }
);

server.tool(
  'find_coaches',
  'Find nearby women fitness coaches and studios.',
  { speciality: z.string().optional().describe('Coach speciality') },
  async ({ speciality }) => {
    const coaches = getCoaches({ speciality });
    const text = coaches.map(c => `🏋️‍♀️ **${c.name}** — Coach: ${c.coach}\n${c.speciality} · ${c.experience} · ⭐ ${c.rating}\n📍 ${c.address} · ${c.distance}\n💰 ${c.fee} · 🕐 ${c.timings}`).join('\n\n');
    return { content: [{ type: 'text', text: `🏃‍♀️ Nearby Coaches:\n\n${text}` }] };
  }
);

// ════════════════════════════════════════════════
// 🧘 HerShanti — Mental Wellness
// ════════════════════════════════════════════════

server.tool(
  'guided_meditation',
  'Get a guided meditation session. Categories: breathing, relaxation, gratitude, sleep, self-love, anxiety.',
  { category: z.string().optional().describe('Meditation category') },
  async ({ category }) => {
    const sessions = getMeditations(category);
    const text = sessions.map(s => `🧘 **${s.title}** (${s.durationMin} min)\n${s.description}\n\nSteps:\n${s.steps.map((st, i) => `${i + 1}. ${st}`).join('\n')}`).join('\n\n---\n\n');
    return { content: [{ type: 'text', text }] };
  }
);

server.tool(
  'mood_reflection',
  'Get a mood-based reflection prompt and affirmation.',
  { mood: z.enum(['happy', 'calm', 'anxious', 'sad', 'angry', 'grateful', 'tired', 'hopeful', 'overwhelmed', 'neutral']).describe('Current mood') },
  async ({ mood }) => {
    const prompt = getReflectionPrompt(mood);
    const affirmation = getRandomAffirmation();
    return { content: [{ type: 'text', text: `💜 **Mood: ${mood}**\n\n📝 Reflection: ${prompt}\n\n🌟 Affirmation: "${affirmation}"` }] };
  }
);

server.tool(
  'find_therapists',
  'Find women therapists for mental health support.',
  { speciality: z.string().optional().describe('Therapist speciality'), city: z.string().optional().describe('City name') },
  async ({ speciality, city }) => {
    const therapists = getTherapists({ speciality, city, available: true });
    const text = therapists.map(t => `👩‍⚕️ **${t.name}** — ${t.speciality}\n${t.experience} · ⭐ ${t.rating} · ${t.mode}\n${t.bio}\nLanguages: ${t.languages.join(', ')}`).join('\n\n');
    return { content: [{ type: 'text', text: `🧑‍⚕️ Therapists:\n\n${text}` }] };
  }
);

// ════════════════════════════════════════════════
// 💰 HerPaisa — Finance
// ════════════════════════════════════════════════

server.tool(
  'finance_tips',
  'Get financial literacy tips for women.',
  { category: z.string().optional().describe('Category: savings, budgeting, spending, digital, schemes, investing, debt, insurance') },
  async ({ category }) => {
    const tips = getFinanceTips(category);
    const text = tips.map(t => `💡 **${t.title}**: ${t.tip}`).join('\n\n');
    return { content: [{ type: 'text', text: `💰 Finance Tips:\n\n${text}` }] };
  }
);

server.tool(
  'generate_upi_payment',
  'Generate a UPI payment link for Google Pay, BharatPe, or PhonePe.',
  { amount: z.number().min(1).describe('Amount in INR'), note: z.string().optional().describe('Payment note') },
  async ({ amount, note }) => {
    const payment = generateUPILink({ amount, note });
    return { content: [{ type: 'text', text: `💳 UPI Payment Link Generated:\n\nAmount: ₹${payment.amount}\nRef: ${payment.txnRef}\n\n💚 Google Pay: ${payment.googlePay}\n🔵 BharatPe: ${payment.bharatPe}\n💜 PhonePe: ${payment.phonePe}\n📱 Any UPI App: ${payment.upiURI}` }] };
  }
);

// ════════════════════════════════════════════════
// 🚀 HerUdaan — Career
// ════════════════════════════════════════════════

server.tool(
  'search_jobs',
  'Search job listings for women. Filters: category, type, remote, return-friendly.',
  { category: z.string().optional(), type: z.string().optional().describe('Full-time, Part-time, Freelance, Internship'), remote: z.boolean().optional(), returnFriendly: z.boolean().optional().describe('Jobs welcoming career returners') },
  async ({ category, type, remote, returnFriendly }) => {
    const jobs = getJobs({ category, type, remote, returnFriendly });
    const text = jobs.map(j => `💼 **${j.title}** — ${j.company}\n${j.type} · ${j.location} · ${j.salary}\n${j.description}\n${j.returnFriendly ? '🔄 Return-Friendly' : ''}`).join('\n\n');
    return { content: [{ type: 'text', text: `💼 Job Listings:\n\n${text}` }] };
  }
);

server.tool(
  'find_mentors',
  'Find career mentors for women.',
  { speciality: z.string().optional().describe('Mentor speciality area') },
  async ({ speciality }) => {
    const mentors = getMentors({ speciality, available: true });
    const text = mentors.map(m => `🧑‍🏫 **${m.name}** — ${m.title}\n${m.speciality} · ${m.experience} · ⭐ ${m.rating}\n${m.bio}`).join('\n\n');
    return { content: [{ type: 'text', text: `🧑‍🏫 Mentors:\n\n${text}` }] };
  }
);

server.tool(
  'skill_courses',
  'Get curated skill courses for career growth.',
  { category: z.string().optional().describe('Category: tech, marketing, finance, design, softskills, writing, language, management') },
  async ({ category }) => {
    const courses = getSkillCourses(category);
    const text = courses.map(c => `📚 **${c.title}** — ${c.provider}\n${c.duration} · ${c.level} · ${c.free ? 'FREE' : 'Paid'}${c.certificate ? ' · 🎓 Certificate' : ''}\n${c.description}`).join('\n\n');
    return { content: [{ type: 'text', text: `📚 Skill Courses:\n\n${text}` }] };
  }
);

server.tool(
  'higher_studies',
  'Get higher education and certification pathways.',
  { category: z.string().optional().describe('Category: management, tech, education, finance, design, writing') },
  async ({ category }) => {
    const programs = getHigherStudies(category);
    const text = programs.map(h => `🎓 **${h.title}** — ${h.institution}\n${h.duration} · ${h.mode} · ${h.fee}\nEligibility: ${h.eligibility}\n${h.description}`).join('\n\n');
    return { content: [{ type: 'text', text: `🎓 Higher Studies:\n\n${text}` }] };
  }
);

// ════════════════════════════════════════════════
// ⚖️ HerAdhikar — Rights & Schemes
// ════════════════════════════════════════════════

server.tool(
  'government_schemes',
  'Find government schemes for women by age group or category.',
  { ageGroup: z.string().optional().describe('Age group: 0–5, 6–14, 15–24, 25–40, 41–59, 60+'), category: z.string().optional().describe('Category: health, education, maternity, nutrition, skills, finance, entrepreneurship, housing, pension') },
  async ({ ageGroup, category }) => {
    const schemes = getSchemes({ ageGroup, category });
    const text = schemes.map(s => `📜 **${s.name}** (${s.type})\n${s.description}\n👤 For: ${s.eligibility}\n🎁 Benefits: ${s.benefits}\n📝 How to apply: ${s.howToApply}${s.portal ? `\n🌐 Portal: ${s.portal}` : ''}`).join('\n\n---\n\n');
    return { content: [{ type: 'text', text: `📜 Government Schemes:\n\n${text}` }] };
  }
);

server.tool(
  'check_scheme_eligibility',
  'Check which government schemes a woman is eligible for based on age, income, and category.',
  { age: z.number().min(0).max(120).describe('Age in years'), income: z.number().optional().describe('Annual family income in INR'), caste: z.string().optional().describe('Category: General, OBC, SC, ST') },
  async ({ age, income, caste }) => {
    const results = checkEligibility({ age, income, caste });
    const text = results.map(r => `${r.matchLevel === 'eligible' ? '✅' : '🟡'} **${r.scheme.name}**\nStatus: ${r.matchLevel}\n${r.reason}\nBenefits: ${r.scheme.benefits}`).join('\n\n');
    return { content: [{ type: 'text', text: `✅ Eligibility Check (Age: ${age}):\n\nFound ${results.length} scheme(s):\n\n${text}` }] };
  }
);

server.tool(
  'insurance_schemes',
  'Get government insurance schemes for women — health, life, accident, maternity.',
  { type: z.string().optional().describe('Insurance type') },
  async ({ type }) => {
    const insurance = getInsurance(type);
    const text = insurance.map(i => `🛡️ **${i.name}**\nType: ${i.type} · Premium: ${i.premium}\nCoverage: ${i.coverage}\n${i.description}\nEnroll: ${i.enrollment}`).join('\n\n');
    return { content: [{ type: 'text', text: `🛡️ Insurance Schemes:\n\n${text}` }] };
  }
);

server.tool(
  'womens_rights',
  'Know your legal rights as a woman in India.',
  { category: z.string().optional().describe('Category: employment, safety, maternity, property, legal, education, health') },
  async ({ category }) => {
    const rights = getRights(category);
    const text = rights.map(r => `⚖️ **${r.title}**\n📜 Law: ${r.law}\n${r.description}`).join('\n\n');
    return { content: [{ type: 'text', text: `⚖️ Women's Rights:\n\n${text}` }] };
  }
);

// ════════════════════════════════════════════════
// 🎓 HerShiksha — Education
// ════════════════════════════════════════════════

server.tool(
  'scholarships',
  'Find scholarships for women — national and international.',
  { type: z.string().optional().describe('National or International') },
  async ({ type }) => {
    const scholarships = getScholarships(type);
    const text = scholarships.map(s => `🎓 **${s.name}** (${s.type})\nProvider: ${s.provider}\nEligibility: ${s.eligibility}\nBenefits: ${s.benefits}\nDeadline: ${s.deadline}\nApply: ${s.howToApply}`).join('\n\n');
    return { content: [{ type: 'text', text: `🎓 Scholarships:\n\n${text}` }] };
  }
);

server.tool(
  'online_courses',
  'Get recommended online courses from Khan Academy, Coursera, edX, and more.',
  { category: z.string().optional().describe('Category: tech, finance, business, design, language, wellness, digital, academics') },
  async ({ category }) => {
    const courses = getEduCourses(category);
    const text = courses.map(c => `💻 **${c.title}** — ${c.platform}\n${c.level} · ${c.duration} · ${c.free ? 'FREE' : 'Paid'}\n${c.description}${c.familyTip ? `\n${c.familyTip}` : ''}`).join('\n\n');
    return { content: [{ type: 'text', text: `💻 Online Courses:\n\n${text}` }] };
  }
);

server.tool(
  'certifications',
  'Get industry-recognized certification recommendations.',
  {},
  async () => {
    const certs = getCertifications();
    const text = certs.map(c => `📜 **${c.name}** — ${c.provider}\n${c.duration} · ${c.cost}\nFields: ${c.fields.join(', ')}\n${c.value}`).join('\n\n');
    return { content: [{ type: 'text', text: `📜 Certifications:\n\n${text}` }] };
  }
);

// ── Start Server ──────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[HERSHIELD MCP] Server started');
}

main().catch(console.error);
