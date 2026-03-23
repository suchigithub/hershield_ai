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

// ── Motivational YouTube Videos ──────────────────
const YOUTUBE_VIDEOS = [
  { id: 'yt-1', title: 'The Power of Vulnerability', speaker: 'Brené Brown', category: 'self-love', duration: '20 min', youtubeId: 'iCvmsMzlF7o', description: 'A TED Talk on how embracing vulnerability leads to genuine connection, courage, and compassion.' },
  { id: 'yt-2', title: 'How to Make Stress Your Friend', speaker: 'Kelly McGonigal', category: 'stress', duration: '15 min', youtubeId: 'RcGyVTAoXEU', description: 'Reframe how you think about stress — it can actually make you healthier and more socially connected.' },
  { id: 'yt-3', title: 'The Happy Secret to Better Work', speaker: 'Shawn Achor', category: 'happiness', duration: '12 min', youtubeId: 'fLJsdqxnZb0', description: 'Positive psychology insights on why happiness fuels success, not the other way around.' },
  { id: 'yt-4', title: 'All It Takes Is 10 Mindful Minutes', speaker: 'Andy Puddicombe', category: 'meditation', duration: '10 min', youtubeId: 'qzR62JJCMBQ', description: 'A simple case for mindfulness meditation — refreshing your mind 10 minutes a day.' },
  { id: 'yt-5', title: 'Your Body Language May Shape Who You Are', speaker: 'Amy Cuddy', category: 'confidence', duration: '21 min', youtubeId: 'Ks-_Mh1QhMc', description: 'Power poses can change how you feel about yourself — body language affects our brain chemistry.' },
  { id: 'yt-6', title: 'The Skill of Self-Confidence', speaker: 'Dr. Ivan Joseph', category: 'confidence', duration: '13 min', youtubeId: 'w-HYZv6HzAs', description: 'Practical strategies for building self-confidence through repetition and positive self-talk.' },
  { id: 'yt-7', title: 'How to Practice Emotional First Aid', speaker: 'Guy Winch', category: 'self-care', duration: '17 min', youtubeId: 'F2hc2FLOdhI', description: 'We brush our teeth daily but what do we do for our emotional hygiene? A must-watch on self-care.' },
  { id: 'yt-8', title: 'Healing Meditation for Inner Peace', speaker: 'Goodful', category: 'meditation', duration: '10 min', youtubeId: 'z6X5oEIg6Ak', description: 'A calming guided meditation for stress relief and inner peace. Perfect for beginners.' },
  { id: 'yt-9', title: 'Overcoming Anxiety', speaker: 'Olivia Remes', category: 'anxiety', duration: '15 min', youtubeId: 'WWloIAQpMcQ', description: 'Practical tips to overcome anxiety from a University of Cambridge researcher.' },
  { id: 'yt-10', title: 'The Power of Believing You Can Improve', speaker: 'Carol Dweck', category: 'growth', duration: '10 min', youtubeId: '_X0mgOOSpLU', description: 'The growth mindset — the belief that you can improve — is the key to achievement.' },
  { id: 'yt-11', title: 'Yoga for Anxiety and Stress', speaker: 'Yoga With Adriene', category: 'yoga', duration: '28 min', youtubeId: 'hJbRpHZr_d0', description: 'A gentle yoga session designed specifically to calm the nervous system and relieve stress.' },
  { id: 'yt-12', title: 'Why We All Need to Practice Emotional First Aid', speaker: 'Guy Winch', category: 'self-care', duration: '8 min', youtubeId: 'sGlSi16WNFU', description: 'Short and powerful talk on why emotional health deserves the same attention as physical health.' },
  { id: 'yt-13', title: 'How Gratitude Rewires Your Brain', speaker: 'Christina Costa', category: 'gratitude', duration: '12 min', youtubeId: 'NGRG0fEBp8I', description: 'Neuroscience-backed explanation of how a gratitude practice literally rewires your brain for happiness.' },
  { id: 'yt-14', title: 'Sleep Meditation — Guided Calm', speaker: 'Jason Stephenson', category: 'sleep', duration: '45 min', youtubeId: 'rvaqPPjGGDo', description: 'A deeply relaxing guided sleep meditation for insomnia, anxiety, and restful sleep.' },
  { id: 'yt-15', title: 'Letting Go of Anger', speaker: 'The School of Life', category: 'anger', duration: '6 min', youtubeId: 'x4v0sRJT6P8', description: 'Understanding anger and learning healthy ways to process and release it.' },
];

const VIDEO_CATEGORIES = ['all', 'self-love', 'stress', 'happiness', 'meditation', 'confidence', 'self-care', 'anxiety', 'growth', 'yoga', 'gratitude', 'sleep', 'anger'];

const getYouTubeVideos = (category = null) => {
  if (category && category !== 'all') return YOUTUBE_VIDEOS.filter((v) => v.category === category);
  return YOUTUBE_VIDEOS;
};

const getVideoById = (id) => {
  return YOUTUBE_VIDEOS.find((v) => v.id === id) || null;
};

// ── AI Wellness Notifications ──────────────────
const AI_NOTIFICATIONS = {
  morning: [
    { icon: '🌅', title: 'Good Morning!', message: 'Start your day with a 5-minute breathing exercise. Your mind will thank you.', action: 'meditate', link: 'med-1' },
    { icon: '🌸', title: 'New Day, New Strength', message: 'You survived 100% of your worst days. You are stronger than you think.', action: 'affirmation' },
    { icon: '📝', title: 'Morning Check-in', message: 'How are you feeling today? Take a moment to log your mood.', action: 'journal' },
    { icon: '🎥', title: 'Morning Motivation', message: 'Watch a short motivational video to set the tone for your day.', action: 'video', link: 'yt-3' },
  ],
  afternoon: [
    { icon: '☀️', title: 'Midday Reset', message: 'Feeling overwhelmed? Try the 5-4-3-2-1 grounding technique.', action: 'meditate', link: 'med-6' },
    { icon: '💪', title: 'You\'re Doing Great', message: 'Halfway through the day! Remember to hydrate and take a stretch break.', action: 'affirmation' },
    { icon: '🎥', title: 'Quick Inspiration', message: 'Take 10 minutes to watch something uplifting. You deserve a mental break.', action: 'video', link: 'yt-4' },
    { icon: '🧘', title: 'Stress Check', message: 'If stress is building up, try our Stress Relief meditation.', action: 'meditate', link: 'med-2' },
  ],
  evening: [
    { icon: '🌙', title: 'Evening Wind-Down', message: 'It is time to let go of the day. Try a gratitude meditation before bed.', action: 'meditate', link: 'med-3' },
    { icon: '📝', title: 'Evening Reflection', message: 'Before bed, journal about three good things that happened today.', action: 'journal' },
    { icon: '😴', title: 'Better Sleep Tonight', message: 'Trouble sleeping? Our Sleep Wind-Down meditation can help.', action: 'meditate', link: 'med-4' },
    { icon: '🎥', title: 'Calm Before Sleep', message: 'Watch a calming guided meditation video to help you relax.', action: 'video', link: 'yt-14' },
  ],
  mood_based: {
    anxious: [
      { icon: '🫂', title: 'Anxiety Support', message: 'We noticed you have been feeling anxious. You are not alone. Try our Anxiety Anchor meditation.', action: 'meditate', link: 'med-6' },
      { icon: '🎥', title: 'Watch: Overcoming Anxiety', message: 'This practical video by Olivia Remes has helped millions with anxiety.', action: 'video', link: 'yt-9' },
    ],
    sad: [
      { icon: '💜', title: 'We See You', message: 'Sadness is a valid feeling. Be gentle with yourself. Would you like to talk to a therapist?', action: 'therapist' },
      { icon: '🎥', title: 'Emotional First Aid', message: 'This video will remind you of the importance of caring for your emotional well-being.', action: 'video', link: 'yt-7' },
    ],
    stressed: [
      { icon: '🧘', title: 'Stress Relief Available', message: 'Your recent entries show stress building up. Try our Stress Relief session.', action: 'meditate', link: 'med-2' },
      { icon: '🎥', title: 'Make Stress Your Friend', message: 'Kelly McGonigal explains how to reframe stress into something positive.', action: 'video', link: 'yt-2' },
    ],
    tired: [
      { icon: '😴', title: 'Rest Is Productive', message: 'Your body is telling you something. Give yourself permission to rest today.', action: 'meditate', link: 'med-4' },
      { icon: '🎥', title: 'Sleep Meditation', message: 'This guided sleep meditation has helped thousands find restful sleep.', action: 'video', link: 'yt-14' },
    ],
    happy: [
      { icon: '🎉', title: 'Celebrate Your Joy!', message: 'You have been feeling great! Keep going. Consider sharing your positivity.', action: 'affirmation' },
      { icon: '🎥', title: 'Gratitude Boost', message: 'Learn how gratitude can make happiness last even longer.', action: 'video', link: 'yt-13' },
    ],
    angry: [
      { icon: '🌊', title: 'Breathe Through It', message: 'Anger is energy. Channel it. Try a self-compassion meditation.', action: 'meditate', link: 'med-5' },
      { icon: '🎥', title: 'Letting Go of Anger', message: 'A thoughtful and practical video on understanding and releasing anger.', action: 'video', link: 'yt-15' },
    ],
  },
};

const getAINotifications = (userId, moodData = {}) => {
  const hour = new Date().getHours();
  let timeOfDay = 'morning';
  if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17) timeOfDay = 'evening';

  const notifications = [];

  // Time-based notification
  const timeNotifs = AI_NOTIFICATIONS[timeOfDay];
  notifications.push({ ...timeNotifs[Math.floor(Math.random() * timeNotifs.length)], type: 'time-based', timeOfDay });

  // Mood-based notification if recent mood available
  if (moodData.dominantMood && AI_NOTIFICATIONS.mood_based[moodData.dominantMood]) {
    const moodNotifs = AI_NOTIFICATIONS.mood_based[moodData.dominantMood];
    notifications.push({ ...moodNotifs[Math.floor(Math.random() * moodNotifs.length)], type: 'mood-based', mood: moodData.dominantMood });
  }

  // Daily affirmation notification
  notifications.push({
    icon: '🌟',
    title: 'Daily Affirmation',
    message: getRandomAffirmation(),
    type: 'affirmation',
    action: 'affirmation',
  });

  // Video recommendation
  const randomVideo = YOUTUBE_VIDEOS[Math.floor(Math.random() * YOUTUBE_VIDEOS.length)];
  notifications.push({
    icon: '🎥',
    title: `Watch: ${randomVideo.title}`,
    message: `${randomVideo.description} (${randomVideo.duration})`,
    type: 'video-suggestion',
    action: 'video',
    link: randomVideo.id,
    videoId: randomVideo.youtubeId,
  });

  return notifications;
};

module.exports = {
  getMeditations,
  getMeditationById,
  getTherapists,
  getReflectionPrompt,
  getRandomAffirmation,
  getYouTubeVideos,
  getVideoById,
  getAINotifications,
  VIDEO_CATEGORIES,
  REFLECTION_PROMPTS,
  AFFIRMATIONS,
};
