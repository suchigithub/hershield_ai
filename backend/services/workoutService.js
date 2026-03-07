/**
 * Workout & Coach Service for HerSwasthya.
 *
 * Daily workouts, exercise library, and nearby coach directory.
 */

// ── Exercise Library ────────────────────────────
const WORKOUTS = [
  {
    id: 'w1', title: 'Morning Yoga Flow', category: 'yoga', difficulty: 'beginner', durationMin: 20, caloriesBurned: 120,
    description: 'A gentle full-body yoga flow to energize your morning. Great for flexibility and stress relief.',
    exercises: [
      { name: 'Sun Salutation A', reps: '5 rounds', duration: '5 min' },
      { name: 'Warrior I & II', reps: 'Hold 30s each side', duration: '3 min' },
      { name: 'Triangle Pose', reps: 'Hold 30s each side', duration: '2 min' },
      { name: 'Seated Forward Fold', reps: 'Hold 1 min', duration: '2 min' },
      { name: 'Cat-Cow Stretch', reps: '10 rounds', duration: '3 min' },
      { name: 'Corpse Pose (Savasana)', reps: 'Hold', duration: '5 min' },
    ],
  },
  {
    id: 'w2', title: 'HIIT Fat Burner', category: 'hiit', difficulty: 'intermediate', durationMin: 25, caloriesBurned: 280,
    description: 'High-intensity intervals to boost metabolism and burn calories. No equipment needed.',
    exercises: [
      { name: 'Jumping Jacks', reps: '45s on, 15s rest', duration: '3 min' },
      { name: 'Burpees', reps: '30s on, 30s rest', duration: '3 min' },
      { name: 'Mountain Climbers', reps: '45s on, 15s rest', duration: '3 min' },
      { name: 'High Knees', reps: '45s on, 15s rest', duration: '3 min' },
      { name: 'Squat Jumps', reps: '30s on, 30s rest', duration: '3 min' },
      { name: 'Plank Hold', reps: 'Hold', duration: '2 min' },
      { name: 'Cool Down Stretch', reps: 'Hold each 20s', duration: '5 min' },
    ],
  },
  {
    id: 'w3', title: 'Strength & Tone', category: 'strength', difficulty: 'intermediate', durationMin: 30, caloriesBurned: 220,
    description: 'Build lean muscle with bodyweight exercises. Perfect for toning arms, legs, and core.',
    exercises: [
      { name: 'Push-ups (or Knee Push-ups)', reps: '3 x 12', duration: '4 min' },
      { name: 'Bodyweight Squats', reps: '3 x 15', duration: '4 min' },
      { name: 'Lunges (alternating)', reps: '3 x 12 each leg', duration: '5 min' },
      { name: 'Glute Bridges', reps: '3 x 15', duration: '4 min' },
      { name: 'Plank', reps: '3 x 30s', duration: '3 min' },
      { name: 'Tricep Dips (using chair)', reps: '3 x 10', duration: '4 min' },
      { name: 'Cool Down Stretch', reps: 'Hold each 20s', duration: '5 min' },
    ],
  },
  {
    id: 'w4', title: 'Period-Friendly Gentle', category: 'period-friendly', difficulty: 'beginner', durationMin: 15, caloriesBurned: 70,
    description: 'Light movements designed for days when you\'re on your period. Relieves cramps and improves mood.',
    exercises: [
      { name: 'Child\'s Pose', reps: 'Hold 1 min', duration: '2 min' },
      { name: 'Cat-Cow Stretch', reps: '8 rounds', duration: '2 min' },
      { name: 'Supine Twist', reps: 'Hold 30s each side', duration: '2 min' },
      { name: 'Happy Baby Pose', reps: 'Hold 1 min', duration: '2 min' },
      { name: 'Deep Belly Breathing', reps: '10 breaths', duration: '3 min' },
      { name: 'Legs Up the Wall', reps: 'Hold', duration: '4 min' },
    ],
  },
  {
    id: 'w5', title: 'Cardio Dance', category: 'cardio', difficulty: 'beginner', durationMin: 20, caloriesBurned: 180,
    description: 'Fun dance-based cardio that doesn\'t feel like exercise! Great for mood and heart health.',
    exercises: [
      { name: 'Warm-up March', reps: 'Free movement', duration: '3 min' },
      { name: 'Side Step & Clap', reps: 'Continuous', duration: '3 min' },
      { name: 'Grapevine Steps', reps: 'Continuous', duration: '3 min' },
      { name: 'Salsa Steps', reps: 'Continuous', duration: '3 min' },
      { name: 'Free Dance', reps: 'Let loose!', duration: '5 min' },
      { name: 'Cool Down & Stretch', reps: 'Hold each 20s', duration: '3 min' },
    ],
  },
  {
    id: 'w6', title: 'Core & Abs', category: 'strength', difficulty: 'intermediate', durationMin: 20, caloriesBurned: 160,
    description: 'Targeted core workout for a stronger midsection, better posture, and back pain relief.',
    exercises: [
      { name: 'Crunches', reps: '3 x 15', duration: '3 min' },
      { name: 'Bicycle Crunches', reps: '3 x 12 each', duration: '3 min' },
      { name: 'Plank', reps: '3 x 40s', duration: '3 min' },
      { name: 'Side Plank', reps: '2 x 30s each side', duration: '3 min' },
      { name: 'Flutter Kicks', reps: '3 x 20', duration: '3 min' },
      { name: 'Dead Bug', reps: '3 x 10 each side', duration: '3 min' },
      { name: 'Stretch', reps: 'Hold each 20s', duration: '3 min' },
    ],
  },
  {
    id: 'w7', title: 'Evening Wind-Down', category: 'yoga', difficulty: 'beginner', durationMin: 15, caloriesBurned: 60,
    description: 'Calming stretches and breathwork to prepare your body for restful sleep.',
    exercises: [
      { name: 'Neck Rolls', reps: '5 each direction', duration: '2 min' },
      { name: 'Seated Side Stretch', reps: 'Hold 30s each', duration: '2 min' },
      { name: 'Forward Fold (seated)', reps: 'Hold 1 min', duration: '2 min' },
      { name: 'Reclined Butterfly', reps: 'Hold 2 min', duration: '3 min' },
      { name: 'Legs Up the Wall', reps: 'Hold 3 min', duration: '3 min' },
      { name: '4-7-8 Breathing', reps: '5 cycles', duration: '3 min' },
    ],
  },
  {
    id: 'w8', title: 'Walk & Jog', category: 'cardio', difficulty: 'beginner', durationMin: 30, caloriesBurned: 200,
    description: 'Interval walk-jog routine perfect for beginners building cardio endurance.',
    exercises: [
      { name: 'Brisk Walk Warm-up', reps: 'Continuous', duration: '5 min' },
      { name: 'Jog', reps: '2 min jog, 1 min walk', duration: '9 min' },
      { name: 'Brisk Walk', reps: 'Continuous', duration: '3 min' },
      { name: 'Jog', reps: '2 min jog, 1 min walk', duration: '9 min' },
      { name: 'Cool Down Walk', reps: 'Slow walk', duration: '4 min' },
    ],
  },
];

// ── Nearby Coaches (Mock Directory) ─────────────
const COACHES = [
  { id: 'co1', name: 'Priya Fitness Studio', coach: 'Priya Verma', speciality: 'Yoga & Pilates', experience: '10 years', address: 'Saket, New Delhi', phone: '+91-11-3456-7890', rating: 4.9, distance: '1.5 km', gender: 'Female', certified: true, timings: '6 AM – 10 AM, 5 PM – 8 PM', fee: '₹2,000/month' },
  { id: 'co2', name: 'FitHer Gym', coach: 'Anjali Kapoor', speciality: 'Strength & HIIT', experience: '7 years', address: 'Koramangala, Bangalore', phone: '+91-80-4567-8901', rating: 4.7, distance: '2.3 km', gender: 'Female', certified: true, timings: '5:30 AM – 9 PM', fee: '₹3,500/month' },
  { id: 'co3', name: 'Zen Yoga Center', coach: 'Meena Sundaram', speciality: 'Prenatal & Postnatal Yoga', experience: '12 years', address: 'T Nagar, Chennai', phone: '+91-44-5678-9012', rating: 4.8, distance: '3.0 km', gender: 'Female', certified: true, timings: '7 AM – 11 AM, 4 PM – 7 PM', fee: '₹1,800/month' },
  { id: 'co4', name: 'BodyBoss Training', coach: 'Ritu Malhotra', speciality: 'Weight Loss & Cardio', experience: '8 years', address: 'Baner, Pune', phone: '+91-20-6789-0123', rating: 4.6, distance: '4.2 km', gender: 'Female', certified: true, timings: '6 AM – 12 PM, 4 PM – 9 PM', fee: '₹2,500/month' },
  { id: 'co5', name: 'DanceFit Arena', coach: 'Nisha Reddy', speciality: 'Zumba & Dance Fitness', experience: '5 years', address: 'Jubilee Hills, Hyderabad', phone: '+91-40-7890-1234', rating: 4.5, distance: '2.8 km', gender: 'Female', certified: true, timings: '7 AM – 9 AM, 6 PM – 8 PM', fee: '₹1,500/month' },
  { id: 'co6', name: 'SheFit Personal Training', coach: 'Kavita Joshi', speciality: 'Personal Training', experience: '9 years', address: 'Viman Nagar, Pune', phone: '+91-20-8901-2345', rating: 4.8, distance: '5.0 km', gender: 'Female', certified: true, timings: 'By Appointment', fee: '₹4,000/month' },
];

// ── Suggested Weekly Plans ──────────────────────
const SUGGESTED_PLANS = {
  beginner: [
    { day: 'monday', workoutId: 'w1', title: 'Morning Yoga Flow' },
    { day: 'tuesday', workoutId: 'w8', title: 'Walk & Jog' },
    { day: 'wednesday', workoutId: 'w5', title: 'Cardio Dance' },
    { day: 'thursday', workoutId: 'w7', title: 'Evening Wind-Down' },
    { day: 'friday', workoutId: 'w3', title: 'Strength & Tone' },
    { day: 'saturday', workoutId: 'w5', title: 'Cardio Dance' },
    { day: 'sunday', workoutId: null, title: 'Rest Day 😴' },
  ],
  intermediate: [
    { day: 'monday', workoutId: 'w2', title: 'HIIT Fat Burner' },
    { day: 'tuesday', workoutId: 'w3', title: 'Strength & Tone' },
    { day: 'wednesday', workoutId: 'w1', title: 'Morning Yoga Flow' },
    { day: 'thursday', workoutId: 'w6', title: 'Core & Abs' },
    { day: 'friday', workoutId: 'w2', title: 'HIIT Fat Burner' },
    { day: 'saturday', workoutId: 'w8', title: 'Walk & Jog' },
    { day: 'sunday', workoutId: 'w7', title: 'Evening Wind-Down' },
  ],
};

// ── API ─────────────────────────────────────────
const getWorkouts = (category = null) => {
  if (category) return WORKOUTS.filter((w) => w.category === category);
  return WORKOUTS;
};

const getWorkoutById = (id) => WORKOUTS.find((w) => w.id === id) || null;

const getCoaches = (filters = {}) => {
  let list = [...COACHES];
  if (filters.speciality) list = list.filter((c) => c.speciality.toLowerCase().includes(filters.speciality.toLowerCase()));
  return list;
};

const getSuggestedPlan = (level = 'beginner') => {
  return SUGGESTED_PLANS[level] || SUGGESTED_PLANS.beginner;
};

module.exports = { getWorkouts, getWorkoutById, getCoaches, getSuggestedPlan, WORKOUTS, COACHES };
