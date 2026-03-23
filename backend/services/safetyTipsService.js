/**
 * AI Safety Suggestions Service
 *
 * Provides smart, contextual safety tips and suggestions
 * for each HERSHIELD module to help users stay safe and informed.
 */

// ── Per-Category AI Safety Suggestions ──────────

const SAFETY_SUGGESTIONS = {
  hersuraksha: {
    icon: '🛡️',
    module: 'HerSuraksha — Safety',
    color: '#c62828',
    tips: [
      { id: 'ss-1', title: 'Share Live Location', tip: 'Always share your live location with a trusted contact when travelling alone, especially at night. Use WhatsApp or Google Maps live sharing.', priority: 'high', tag: 'travel' },
      { id: 'ss-2', title: 'Save Emergency Numbers', tip: 'Save these numbers: Police 112, Women Helpline 181, Ambulance 108, Child Helpline 1098. Add them to speed dial.', priority: 'high', tag: 'emergency' },
      { id: 'ss-3', title: 'Trust Your Instincts', tip: 'If a situation feels wrong, leave immediately. Your gut feeling is often right. Do not worry about being polite when your safety is at risk.', priority: 'high', tag: 'awareness' },
      { id: 'ss-4', title: 'Safe Ride Verification', tip: 'Before getting into a cab, verify the driver name, car number, and OTP. Share trip details with a trusted person.', priority: 'medium', tag: 'travel' },
      { id: 'ss-5', title: 'Self-Defense Basics', tip: 'Learn basic self-defense moves: palm strike to the nose, knee to the groin, and elbow strikes. Even knowing one move can save you.', priority: 'medium', tag: 'self-defense' },
      { id: 'ss-6', title: 'Digital Safety', tip: 'Never share your OTP, passwords, or personal photos with strangers online. Enable two-factor authentication on all accounts.', priority: 'high', tag: 'digital' },
      { id: 'ss-7', title: 'Safe Walking Habits', tip: 'Walk confidently, stay alert, avoid using earphones in isolated areas, keep your phone charged, and stick to well-lit routes.', priority: 'medium', tag: 'travel' },
      { id: 'ss-8', title: 'Workplace Safety', tip: 'Document any harassment with dates and details. Know your company\'s POSH (Prevention of Sexual Harassment) committee and reporting process.', priority: 'high', tag: 'workplace' },
    ],
  },

  herpaisa: {
    icon: '💰',
    module: 'HerPaisa — Finance',
    color: '#7b1fa2',
    tips: [
      { id: 'fp-1', title: 'UPI Fraud Alert', tip: 'Never scan unknown QR codes or click UPI payment links from strangers. Remember: you never need to "receive" money by entering your PIN.', priority: 'high', tag: 'fraud' },
      { id: 'fp-2', title: 'Keep Emergency Fund', tip: 'Save at least 3 months of expenses in an easily accessible account. Financial independence is key to personal safety.', priority: 'high', tag: 'savings' },
      { id: 'fp-3', title: 'Own Bank Account', tip: 'Every woman should have her own bank account that only she controls. Financial independence is foundational to personal freedom.', priority: 'high', tag: 'independence' },
      { id: 'fp-4', title: 'Secure Your Cards', tip: 'Never share your card CVV or PIN. Set transaction alerts. If your card is lost, block it immediately via your bank app.', priority: 'medium', tag: 'digital' },
      { id: 'fp-5', title: 'Loan Scam Awareness', tip: 'Beware of instant loan apps that ask for camera/contact permissions. They often harass borrowers. Only use RBI-registered lenders.', priority: 'high', tag: 'fraud' },
      { id: 'fp-6', title: 'Investment Knowledge', tip: 'Before investing, understand the risks. If someone promises guaranteed high returns, it is likely a scam. Research before you invest.', priority: 'medium', tag: 'investment' },
    ],
  },

  herswasthya: {
    icon: '❤️',
    module: 'HerSwasthya — Health',
    color: '#c62828',
    tips: [
      { id: 'hs-1', title: 'Regular Health Checkups', tip: 'Get annual health checkups including breast examination, Pap smear, thyroid test, and blood sugar levels. Early detection saves lives.', priority: 'high', tag: 'preventive' },
      { id: 'hs-2', title: 'Know Your Medicines', tip: 'Never take medicines from unknown people. Always verify prescriptions with a certified doctor. Check medicine expiry dates.', priority: 'high', tag: 'safety' },
      { id: 'hs-3', title: 'Period Tracking Awareness', tip: 'Track your period regularly. Significant changes in cycle length, flow, or symptoms can indicate health issues — consult a doctor.', priority: 'medium', tag: 'menstrual' },
      { id: 'hs-4', title: 'Safe Doctor Visits', tip: 'You have the right to a female doctor or a female attendant during any physical examination. Never hesitate to ask.', priority: 'high', tag: 'rights' },
      { id: 'hs-5', title: 'Fitness Safety', tip: 'When exercising outdoors alone, share your route, carry ID, and stay in public areas. Prefer early morning or well-lit evening hours.', priority: 'medium', tag: 'fitness' },
      { id: 'hs-6', title: 'Mental Health Matters', tip: 'Mental health is as important as physical health. Do not ignore prolonged sadness, anxiety, or sleep disturbances. Seek help.', priority: 'high', tag: 'mental' },
    ],
  },

  hershanti: {
    icon: '🧘',
    module: 'HerShanti — Mental Wellness',
    color: '#6a1b9a',
    tips: [
      { id: 'mw-1', title: 'Recognize Emotional Abuse', tip: 'Constant criticism, gaslighting, isolation from family/friends, and controlling behavior are forms of emotional abuse. You deserve better.', priority: 'high', tag: 'awareness' },
      { id: 'mw-2', title: 'Safe Digital Spaces', tip: 'Block and report online harassment immediately. Do not engage. Screenshot evidence. Cyber harassment is a punishable offence under IT Act Section 66A.', priority: 'high', tag: 'digital' },
      { id: 'mw-3', title: 'Trusted Support Network', tip: 'Build a circle of 2-3 trusted people you can call anytime. Isolation makes you vulnerable — connection makes you strong.', priority: 'high', tag: 'support' },
      { id: 'mw-4', title: 'Stress Response Plan', tip: 'Create a personal safety/wellbeing plan: who to call, where to go, what to do when overwhelmed. Having a plan reduces panic.', priority: 'medium', tag: 'planning' },
      { id: 'mw-5', title: 'Boundaries Are Safety', tip: 'Setting boundaries is not rude — it is essential. Practice saying no without guilt. Healthy boundaries protect your mental health.', priority: 'medium', tag: 'self-care' },
      { id: 'mw-6', title: 'Therapy Is Strength', tip: 'Seeking therapy is a sign of strength, not weakness. A therapist provides tools to navigate life challenges and trauma safely.', priority: 'medium', tag: 'support' },
    ],
  },

  herudaan: {
    icon: '🚀',
    module: 'HerUdaan — Career',
    color: '#8e24aa',
    tips: [
      { id: 'cr-1', title: 'Workplace Rights', tip: 'Know your POSH rights. Every organisation with 10+ employees must have an Internal Complaints Committee. File complaints within 3 months.', priority: 'high', tag: 'rights' },
      { id: 'cr-2', title: 'Safe Job Search', tip: 'Never pay to get a job — that is a scam. Verify companies on MCA portal. Avoid jobs asking for personal documents upfront.', priority: 'high', tag: 'fraud' },
      { id: 'cr-3', title: 'Interview Safety', tip: 'For first interviews, prefer public or office locations. Inform someone of the interview address and time. Avoid isolated meeting spots.', priority: 'high', tag: 'safety' },
      { id: 'cr-4', title: 'Equal Pay Awareness', tip: 'The Equal Remuneration Act mandates equal pay for equal work regardless of gender. Know your salary rights and negotiate confidently.', priority: 'medium', tag: 'rights' },
      { id: 'cr-5', title: 'Maternity Benefits', tip: 'Under the Maternity Benefit Act 2017, you are entitled to 26 weeks of paid leave. Know your rights before and after childbirth.', priority: 'medium', tag: 'rights' },
      { id: 'cr-6', title: 'Networking Safety', tip: 'Meet professional contacts in public spaces. Be cautious of "mentors" who insist on private meetings. Trust your instincts.', priority: 'medium', tag: 'safety' },
    ],
  },

  heradhikar: {
    icon: '⚖️',
    module: 'HerAdhikar — Rights & Schemes',
    color: '#ad1457',
    tips: [
      { id: 'rg-1', title: 'Know Your Legal Rights', tip: 'Under Section 498A IPC, domestic violence is a criminal offence. You can file an FIR, get protection orders, and claim maintenance.', priority: 'high', tag: 'legal' },
      { id: 'rg-2', title: 'Free Legal Aid', tip: 'Women are entitled to free legal aid under the Legal Services Authority Act regardless of income. Contact your district legal aid centre.', priority: 'high', tag: 'legal' },
      { id: 'rg-3', title: 'Protection Against Dowry', tip: 'Demanding or giving dowry is illegal under the Dowry Prohibition Act 1961. You can file a complaint with the police or Women Commission.', priority: 'high', tag: 'legal' },
      { id: 'rg-4', title: 'Government Scheme Awareness', tip: 'Check if you are eligible for schemes like Sukanya Samriddhi, PMJDY, Ujjwala, Mahila Samridhi Yojana. These provide financial empowerment.', priority: 'medium', tag: 'schemes' },
      { id: 'rg-5', title: 'Property Rights', tip: 'Under the Hindu Succession Act (amended 2005), daughters have equal rights to ancestral property. Know your inheritance rights.', priority: 'high', tag: 'legal' },
      { id: 'rg-6', title: 'Report Helplines', tip: 'National Commission for Women: 7827-170-170, Domestic Violence Helpline: 181, Cyber Crime: cybercrime.gov.in. Save these contacts.', priority: 'high', tag: 'emergency' },
    ],
  },

  hershiksha: {
    icon: '🎓',
    module: 'HerShiksha — Education',
    color: '#7b1fa2',
    tips: [
      { id: 'ed-1', title: 'Scholarship Scam Alert', tip: 'Genuine government scholarships never ask for processing fees. Apply only through official portals like scholarships.gov.in.', priority: 'high', tag: 'fraud' },
      { id: 'ed-2', title: 'Safe Online Learning', tip: 'Use only verified platforms (NPTEL, Coursera, Khan Academy). Avoid unknown course sites asking for Aadhaar or sensitive details.', priority: 'medium', tag: 'digital' },
      { id: 'ed-3', title: 'Campus Safety', tip: 'Know your college anti-ragging helpline (1800-180-5522). Report any ragging or harassment immediately — it is a punishable offence.', priority: 'high', tag: 'safety' },
      { id: 'ed-4', title: 'Right to Education', tip: 'Education is a fundamental right. If you face discrimination in admission, contact the District Education Officer or file RTI.', priority: 'high', tag: 'rights' },
      { id: 'ed-5', title: 'Document Safety', tip: 'Keep certified copies of all educational documents. Never hand over originals to coaching centres or employers. Digitize and store securely.', priority: 'medium', tag: 'documents' },
      { id: 'ed-6', title: 'Skill Building', tip: 'Free government skill programs like PMKVY and NSDC offer training with certificates. These boost employability without any cost.', priority: 'medium', tag: 'skills' },
    ],
  },
};

// ── Get tips for a specific module ──
const getSafetyTips = (module = null, tag = null) => {
  if (module && SAFETY_SUGGESTIONS[module]) {
    const data = SAFETY_SUGGESTIONS[module];
    let tips = data.tips;
    if (tag) tips = tips.filter((t) => t.tag === tag);
    return { ...data, tips };
  }
  // Return all modules summary
  return Object.entries(SAFETY_SUGGESTIONS).map(([key, val]) => ({
    key,
    icon: val.icon,
    module: val.module,
    color: val.color,
    tipCount: val.tips.length,
    highPriority: val.tips.filter((t) => t.priority === 'high').length,
  }));
};

// ── Get AI-curated daily safety suggestion per module ──
const getDailySafetyDigest = () => {
  const digest = Object.entries(SAFETY_SUGGESTIONS).map(([key, val]) => {
    const tip = val.tips[Math.floor(Math.random() * val.tips.length)];
    return {
      module: key,
      icon: val.icon,
      moduleName: val.module,
      color: val.color,
      tip,
    };
  });
  return digest;
};

// ── Get quick safety tip for a given context ──
const getContextualTip = (context = 'general') => {
  const contextMap = {
    travel: ['hersuraksha'],
    digital: ['hersuraksha', 'herpaisa', 'hershanti', 'hershiksha'],
    fraud: ['herpaisa', 'herudaan', 'hershiksha'],
    emergency: ['hersuraksha', 'heradhikar'],
    workplace: ['herudaan', 'hersuraksha'],
    legal: ['heradhikar'],
    health: ['herswasthya'],
    mental: ['hershanti', 'herswasthya'],
    general: Object.keys(SAFETY_SUGGESTIONS),
  };

  const modules = contextMap[context] || contextMap.general;
  const allTips = modules.flatMap((m) => {
    const mod = SAFETY_SUGGESTIONS[m];
    return mod ? mod.tips.filter((t) => context === 'general' || t.tag === context).map((t) => ({ ...t, module: m, icon: mod.icon, moduleName: mod.module, color: mod.color })) : [];
  });

  if (allTips.length === 0) {
    // Fallback: random tip from any module
    const allModTips = Object.entries(SAFETY_SUGGESTIONS).flatMap(([key, val]) =>
      val.tips.map((t) => ({ ...t, module: key, icon: val.icon, moduleName: val.module, color: val.color }))
    );
    return allModTips[Math.floor(Math.random() * allModTips.length)];
  }

  return allTips[Math.floor(Math.random() * allTips.length)];
};

module.exports = {
  SAFETY_SUGGESTIONS,
  getSafetyTips,
  getDailySafetyDigest,
  getContextualTip,
};
