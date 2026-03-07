/**
 * Wellness Service for HerShanti.
 *
 * Provides guided meditation content, therapist directory,
 * mood-based reflection prompts, and affirmations.
 */

// ── Guided Meditation Sessions ──────────────────
const MEDITATIONS = [
  {
    id: 'med-1',
    title: 'Morning Calm',
    description: 'Start your day with 5 minutes of gentle breathing and positive intentions.',
    category: 'breathing',
    durationMin: 5,
    steps: [
      'Find a comfortable seated position. Close your eyes gently.',
      'Take 3 deep breaths — inhale for 4 counts, hold for 4, exhale for 6.',
      'Feel your body relax with each exhale. Let go of any tension.',
      'Set an intention for the day: "I am calm, capable, and enough."',
      'Continue breathing naturally for 3 minutes. Notice each breath.',
      'Slowly open your eyes. Carry this calm with you today.',
    ],
  },
  {
    id: 'med-2',
    title: 'Stress Relief',
    description: 'Release tension and anxiety with progressive muscle relaxation.',
    category: 'relaxation',
    durationMin: 10,
    steps: [
      'Lie down or sit comfortably. Close your eyes.',
      'Tense the muscles in your feet tightly for 5 seconds, then release.',
      'Move up — tense your calves, then release. Feel the warmth.',
      'Continue with thighs, stomach, hands, shoulders, and face.',
      'Now scan your body. Notice where you still hold tension.',
      'Breathe into those areas. Imagine the tension melting away.',
      'Rest in total relaxation for 3 minutes.',
      'Whisper to yourself: "I release what I cannot control."',
    ],
  },
  {
    id: 'med-3',
    title: 'Gratitude Meditation',
    description: 'Cultivate thankfulness and shift your perspective to the positive.',
    category: 'gratitude',
    durationMin: 7,
    steps: [
      'Sit quietly. Take 5 slow breaths to center yourself.',
      'Think of one person you are grateful for. Visualize their face.',
      'Silently say: "Thank you for being in my life."',
      'Think of one thing about yourself you appreciate.',
      'Think of one simple joy from today — a meal, sunlight, a smile.',
      'Hold all three in your heart. Feel warmth and contentment.',
      'Slowly return. Carry this gratitude through your day.',
    ],
  },
  {
    id: 'med-4',
    title: 'Sleep Wind-Down',
    description: 'Gentle body scan and breathing to prepare for restful sleep.',
    category: 'sleep',
    durationMin: 12,
    steps: [
      'Lie in bed. Let your arms rest by your sides.',
      'Take 5 deep breaths, making each exhale longer than the inhale.',
      'Starting from your toes, mentally "switch off" each body part.',
      'Feet… legs… hips… stomach… softening, releasing.',
      'Chest… arms… hands… neck… jaw… forehead… letting go.',
      'Imagine yourself floating on a warm, calm cloud.',
      'If thoughts arise, gently label them "thinking" and return to the cloud.',
      'Continue breathing softly until sleep comes naturally.',
    ],
  },
  {
    id: 'med-5',
    title: 'Self-Compassion',
    description: 'Be kind to yourself. You deserve the love you give others.',
    category: 'self-love',
    durationMin: 8,
    steps: [
      'Sit comfortably. Place your hand over your heart.',
      'Feel your heartbeat. You are alive. You matter.',
      'Think of something you have been hard on yourself about.',
      'Now imagine a close friend told you the same thing. What would you say?',
      'Offer yourself those same kind words now.',
      'Repeat gently: "I am doing my best. That is enough."',
      'Breathe in self-compassion. Breathe out self-criticism.',
      'Rest here for 2 minutes, feeling warmth in your chest.',
    ],
  },
  {
    id: 'med-6',
    title: 'Anxiety Anchor',
    description: '5-4-3-2-1 grounding technique for moments of anxiety.',
    category: 'anxiety',
    durationMin: 5,
    steps: [
      'Pause wherever you are. Take one deep breath.',
      'Name 5 things you can SEE around you.',
      'Name 4 things you can TOUCH right now.',
      'Name 3 things you can HEAR.',
      'Name 2 things you can SMELL.',
      'Name 1 thing you can TASTE.',
      'Take 3 more breaths. You are here. You are safe.',
      'Whisper: "This moment will pass. I am grounded."',
    ],
  },
];

// ── Therapist Directory (mock) ──────────────────
const THERAPISTS = [
  { id: 'th-1', name: 'Dr. Priya Sharma', speciality: 'Anxiety & Stress', experience: '12 years', languages: ['Hindi', 'English'], mode: 'Online & In-person', city: 'Mumbai', rating: 4.8, available: true },
  { id: 'th-2', name: 'Dr. Anjali Mehta', speciality: 'Depression & Trauma', experience: '9 years', languages: ['Hindi', 'English', 'Gujarati'], mode: 'Online', city: 'Ahmedabad', rating: 4.9, available: true },
  { id: 'th-3', name: 'Dr. Kavita Reddy', speciality: 'Relationship Counseling', experience: '15 years', languages: ['Telugu', 'English', 'Hindi'], mode: 'Online & In-person', city: 'Hyderabad', rating: 4.7, available: true },
  { id: 'th-4', name: 'Dr. Neha Gupta', speciality: 'Postpartum & Women\'s Health', experience: '8 years', languages: ['Hindi', 'English'], mode: 'Online', city: 'Delhi', rating: 4.6, available: true },
  { id: 'th-5', name: 'Dr. Sunita Iyer', speciality: 'Self-esteem & Body Image', experience: '10 years', languages: ['Tamil', 'English', 'Hindi'], mode: 'Online & In-person', city: 'Chennai', rating: 4.8, available: false },
  { id: 'th-6', name: 'Dr. Ritu Kapoor', speciality: 'Career Stress & Burnout', experience: '7 years', languages: ['Hindi', 'English', 'Punjabi'], mode: 'Online', city: 'Chandigarh', rating: 4.5, available: true },
];

// ── Mood-based Reflection Prompts ───────────────
const REFLECTION_PROMPTS = {
  happy: [
    'What made you smile today? How can you create more of these moments?',
    'Who contributed to your happiness? Consider expressing gratitude to them.',
    'What strength of yours showed up today?',
  ],
  calm: [
    'What helped you feel at peace? How can you protect this calm?',
    'Describe the present moment using all five senses.',
    'What boundary have you set recently that gave you peace?',
  ],
  anxious: [
    'What is the worst that could realistically happen? How would you handle it?',
    'Name three things that are within your control right now.',
    'Write a letter to your future self who has already overcome this.',
  ],
  sad: [
    'What are you mourning or missing? Give yourself permission to feel it.',
    'What would you say to a friend feeling this way?',
    'List three small things that have brought you comfort in hard times.',
  ],
  angry: [
    'What boundary was crossed? What need is not being met?',
    'If your anger could speak, what would it say?',
    'What action can you take to honor your feelings without harming yourself?',
  ],
  grateful: [
    'List three things you often take for granted but are thankful for today.',
    'Who has quietly supported you? How can you acknowledge them?',
    'What challenge taught you something valuable?',
  ],
  tired: [
    'What have you been carrying that you can put down today?',
    'What is one thing you can say "no" to this week?',
    'Describe the rest you truly need — physical, mental, or emotional?',
  ],
  hopeful: [
    'What are you looking forward to? Visualize it in detail.',
    'What small step can you take today toward something you dream of?',
    'What past experience reminds you that good things are ahead?',
  ],
  overwhelmed: [
    'List everything on your mind. Now circle only the top 3 priorities.',
    'What can you delegate, delay, or delete from your list?',
    'Take 3 breaths and complete just ONE small task. That\'s enough for now.',
  ],
  neutral: [
    'What does your typical day look like? Is there something you\'d like to change?',
    'When did you last do something just for fun?',
    'What emotion do you wish you felt more often? What brings it out?',
  ],
};

// ── Daily Affirmations ──────────────────────────
const AFFIRMATIONS = [
  'I am worthy of love, rest, and good things.',
  'My feelings are valid. I don\'t need to justify them.',
  'I am growing at my own pace, and that is enough.',
  'I choose peace over perfection today.',
  'I am allowed to take up space and be heard.',
  'My struggles do not define me — my resilience does.',
  'I release the need to control everything.',
  'I trust myself to handle whatever comes.',
  'Today I choose to be gentle with myself.',
  'I am more than my worst moments.',
  'My mental health matters as much as my physical health.',
  'I deserve help and it is brave to ask for it.',
  'I am not alone in this. Other women understand.',
  'Healing is not linear, and setbacks are not failures.',
  'I choose to nourish my mind, body, and soul today.',
];

const getRandomAffirmation = () => {
  return AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
};

const getReflectionPrompt = (mood) => {
  const prompts = REFLECTION_PROMPTS[mood] || REFLECTION_PROMPTS.neutral;
  return prompts[Math.floor(Math.random() * prompts.length)];
};

const getMeditations = (category = null) => {
  if (category) return MEDITATIONS.filter((m) => m.category === category);
  return MEDITATIONS;
};

const getMeditationById = (id) => {
  return MEDITATIONS.find((m) => m.id === id) || null;
};

const getTherapists = (filters = {}) => {
  let list = [...THERAPISTS];
  if (filters.speciality) {
    list = list.filter((t) => t.speciality.toLowerCase().includes(filters.speciality.toLowerCase()));
  }
  if (filters.city) {
    list = list.filter((t) => t.city.toLowerCase() === filters.city.toLowerCase());
  }
  if (filters.available) {
    list = list.filter((t) => t.available);
  }
  return list;
};

module.exports = {
  getMeditations,
  getMeditationById,
  getTherapists,
  getReflectionPrompt,
  getRandomAffirmation,
  REFLECTION_PROMPTS,
  AFFIRMATIONS,
};
