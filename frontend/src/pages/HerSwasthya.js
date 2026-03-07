import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import herswasthyaService from '../services/herswasthyaService';

const TABS = ['home', 'period', 'workout', 'planner', 'tips', 'clinics', 'coaches', 'teleconsult'];
const FLOW_OPTIONS = ['light', 'medium', 'heavy'];
const TIP_CATEGORIES = ['all', 'nutrition', 'fitness', 'menstrual', 'mental', 'lifestyle'];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const HerSwasthya = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('home');

  // ── Home ──
  const [dashboard, setDashboard] = useState(null);

  // ── Period ──
  const [periodLogs, setPeriodLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [symptomsList, setSymptomsList] = useState([]);
  const [periodForm, setPeriodForm] = useState({ startDate: '', endDate: '', flow: 'medium', symptoms: [], notes: '' });

  // ── Tips ──
  const [tips, setTips] = useState([]);
  const [tipCategory, setTipCategory] = useState('all');

  // ── Clinics ──
  const [clinics, setClinics] = useState([]);

  // ── Teleconsult ──
  const [doctors, setDoctors] = useState([]);
  const [consults, setConsults] = useState([]);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookNotes, setBookNotes] = useState('');

  // ── Workouts ──
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [exStep, setExStep] = useState(0);
  const [wkStats, setWkStats] = useState(null);
  const [wkCategory, setWkCategory] = useState('all');

  // ── Planner ──
  const [planner, setPlanner] = useState([]);
  const [planForm, setPlanForm] = useState({ day: 'monday', title: '', time: '07:00', notes: '' });

  // ── Coaches ──
  const [coaches, setCoaches] = useState([]);

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const flash = (m, isErr = false) => {
    if (isErr) { setErr(m); setMsg(''); } else { setMsg(m); setErr(''); }
    setTimeout(() => { setMsg(''); setErr(''); }, 4000);
  };

  const loadDashboard = useCallback(async () => {
    try { const { data } = await herswasthyaService.getDashboard(); setDashboard(data); } catch {}
  }, []);
  const loadPeriod = useCallback(async () => {
    try {
      const [lRes, aRes, sRes] = await Promise.all([
        herswasthyaService.getPeriodLogs(),
        herswasthyaService.getPeriodAnalytics(),
        herswasthyaService.getSymptoms(),
      ]);
      setPeriodLogs(lRes.data.logs);
      setAnalytics(aRes.data.analytics);
      setSymptomsList(sRes.data.symptoms);
    } catch {}
  }, []);
  const loadTips = useCallback(async () => {
    try {
      const cat = tipCategory === 'all' ? undefined : tipCategory;
      const { data } = await herswasthyaService.getHealthTips(cat);
      setTips(data.tips);
    } catch {}
  }, [tipCategory]);
  const loadClinics = useCallback(async () => {
    try { const { data } = await herswasthyaService.getClinics(); setClinics(data.clinics); } catch {}
  }, []);
  const loadTeleconsult = useCallback(async () => {
    try {
      const [dRes, cRes] = await Promise.all([
        herswasthyaService.getDoctors({ available: true }),
        herswasthyaService.getConsultations(),
      ]);
      setDoctors(dRes.data.doctors);
      setConsults(cRes.data.consultations);
    } catch {}
  }, []);
  const loadWorkouts = useCallback(async () => {
    try {
      const cat = wkCategory === 'all' ? undefined : wkCategory;
      const [wRes, sRes] = await Promise.all([herswasthyaService.getWorkouts(cat), herswasthyaService.getWorkoutStats(7)]);
      setWorkouts(wRes.data.workouts);
      setWkStats(sRes.data.stats);
    } catch {}
  }, [wkCategory]);
  const loadPlanner = useCallback(async () => {
    try { const { data } = await herswasthyaService.getPlanner(); setPlanner(data.plan); } catch {}
  }, []);
  const loadCoaches = useCallback(async () => {
    try { const { data } = await herswasthyaService.getCoaches(); setCoaches(data.coaches); } catch {}
  }, []);

  useEffect(() => {
    if (tab === 'home') loadDashboard();
    if (tab === 'period') loadPeriod();
    if (tab === 'tips') loadTips();
    if (tab === 'clinics') loadClinics();
    if (tab === 'teleconsult') loadTeleconsult();
    if (tab === 'workout') loadWorkouts();
    if (tab === 'planner') loadPlanner();
    if (tab === 'coaches') loadCoaches();
  }, [tab, loadDashboard, loadPeriod, loadTips, loadClinics, loadTeleconsult, loadWorkouts, loadPlanner, loadCoaches]);

  useEffect(() => { if (tab === 'tips') loadTips(); }, [tipCategory, loadTips, tab]);
  useEffect(() => { if (tab === 'workout') loadWorkouts(); }, [wkCategory, loadWorkouts, tab]);

  const toggleSymptom = (s) => {
    const has = periodForm.symptoms.includes(s);
    setPeriodForm({
      ...periodForm,
      symptoms: has ? periodForm.symptoms.filter((x) => x !== s) : [...periodForm.symptoms, s],
    });
  };

  const handleLogPeriod = async (e) => {
    e.preventDefault();
    try {
      await herswasthyaService.logPeriod(periodForm);
      setPeriodForm({ startDate: '', endDate: '', flow: 'medium', symptoms: [], notes: '' });
      flash('Period logged! 💗');
      loadPeriod();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleBookConsult = async (doctor) => {
    try {
      const { data } = await herswasthyaService.bookConsultation({ doctorId: doctor.id, notes: bookNotes });
      flash(data.message);
      setBookingDoctor(null);
      setBookNotes('');
      loadTeleconsult();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleCancelConsult = async (id) => {
    try { await herswasthyaService.cancelConsultation(id); flash('Consultation cancelled.'); loadTeleconsult(); }
    catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleCompleteWorkout = async (id) => {
    try {
      const { data } = await herswasthyaService.completeWorkout(id);
      flash(data.message);
      setActiveWorkout(null); setExStep(0);
      loadWorkouts();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
      await herswasthyaService.addPlannerEntry(planForm);
      setPlanForm({ day: 'monday', title: '', time: '07:00', notes: '' });
      flash('Plan added!');
      loadPlanner();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleDeletePlan = async (id) => {
    try { await herswasthyaService.deletePlannerEntry(id); loadPlanner(); } catch {}
  };

  const handleLoadSuggested = async (level) => {
    try {
      const { data } = await herswasthyaService.loadSuggestedPlan(level);
      flash(data.message);
      loadPlanner();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  return (
    <div style={s.wrapper}>
      <button onClick={() => navigate('/dashboard')} style={s.back}>← Dashboard</button>

      {/* ── HERO SECTION ── */}
      <div style={s.hero}>
        <div style={{ fontSize: '2.5rem' }}>❤️</div>
        <h2 style={s.heroTitle}>HerSwasthya — Health</h2>
        <p style={s.heroTagline}>Your health matters.</p>
        <p style={s.heroDesc}>
          Track your wellness, access trusted care, and stay informed — anytime, anywhere.
          HerSwasthya empowers you with simple tools for a healthier, happier life.
        </p>
      </div>

      {msg && <div style={s.success}>{msg}</div>}
      {err && <div style={s.error}>{err}</div>}

      {/* Tab bar */}
      <div className="tab-bar" style={s.tabs}>
        {TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); setBookingDoctor(null); setActiveWorkout(null); }}
            style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
            {t === 'home' ? '🏠 Home' : t === 'period' ? '📅 Period' : t === 'tips' ? '💊 Tips' :
             t === 'clinics' ? '🏥 Clinics' : t === 'teleconsult' ? '📱 Consult' :
             t === 'workout' ? '💪 Workout' : t === 'planner' ? '🗓️ Planner' : '🏃‍♀️ Coaches'}
          </button>
        ))}
      </div>

      {/* ── HOME TAB ── */}
      {tab === 'home' && dashboard && (
        <div>
          <div style={s.card}>
            <p style={{ color: '#c62828', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>💗 {dashboard.greeting}</p>
            {dashboard.tipOfDay && (
              <div style={{ background: '#fff3e0', padding: '0.75rem', borderRadius: '8px' }}>
                <span style={{ marginRight: '0.5rem' }}>{dashboard.tipOfDay.icon}</span>
                <strong>{dashboard.tipOfDay.title}:</strong> {dashboard.tipOfDay.tip}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ ...s.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>📅</div>
              <div style={{ fontWeight: 700, color: '#c62828', fontSize: '1.3rem' }}>
                {dashboard.periodAnalytics.predictedNext || '—'}
              </div>
              <small style={{ color: '#888' }}>Next period (predicted)</small>
            </div>
            <div style={{ ...s.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>📊</div>
              <div style={{ fontWeight: 700, color: '#c62828', fontSize: '1.3rem' }}>
                {dashboard.periodAnalytics.averageCycleLength || 28}
              </div>
              <small style={{ color: '#888' }}>Avg. cycle (days)</small>
            </div>
            <div style={{ ...s.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>📝</div>
              <div style={{ fontWeight: 700, color: '#c62828', fontSize: '1.3rem' }}>
                {dashboard.periodAnalytics.totalLogs}
              </div>
              <small style={{ color: '#888' }}>Periods logged</small>
            </div>
            <div style={{ ...s.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>📱</div>
              <div style={{ fontWeight: 700, color: '#c62828', fontSize: '1.3rem' }}>
                {dashboard.upcomingConsultations}
              </div>
              <small style={{ color: '#888' }}>Upcoming consults</small>
            </div>
          </div>

          {/* Value Proposition */}
          <div style={{ ...s.card, background: '#fce4ec' }}>
            <h4 style={{ color: '#c62828', marginBottom: '0.5rem' }}>Why HerSwasthya?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
              <div>🔒 <strong>Privacy First</strong> — Your health data stays private and secure.</div>
              <div>🌍 <strong>Accessible</strong> — Healthcare guidance anytime, anywhere on your phone.</div>
              <div>👩 <strong>Women-Centric</strong> — Designed for your unique health needs.</div>
              <div>✅ <strong>Trusted Info</strong> — Evidence-based tips from healthcare professionals.</div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ ...s.card, textAlign: 'center', background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)' }}>
            <h3 style={{ color: '#c62828', marginBottom: '0.5rem' }}>Take charge of your health 💗</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Start tracking, get tips, find clinics, and consult doctors — all in one place.</p>
            <button onClick={() => setTab('period')} style={s.btn}>Start Period Tracking →</button>
          </div>
        </div>
      )}

      {/* ── PERIOD TRACKER TAB ── */}
      {tab === 'period' && (
        <div>
          {/* Analytics */}
          {analytics && analytics.totalLogs > 0 && (
            <div style={{ ...s.card, background: '#fce4ec' }}>
              <h4 style={{ color: '#c62828', marginBottom: '0.5rem' }}>Your Cycle Insights</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center', marginBottom: '0.75rem' }}>
                <div><div style={{ fontWeight: 700, color: '#c62828' }}>{analytics.averageCycleLength}d</div><small>Avg cycle</small></div>
                <div><div style={{ fontWeight: 700, color: '#c62828' }}>{analytics.averageDuration || '—'}d</div><small>Avg duration</small></div>
                <div><div style={{ fontWeight: 700, color: '#c62828' }}>{analytics.predictedNext || '—'}</div><small>Next predicted</small></div>
              </div>
              {analytics.commonSymptoms.length > 0 && (
                <div>
                  <small style={{ color: '#888' }}>Most common symptoms:</small>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
                    {analytics.commonSymptoms.map((s) => (
                      <span key={s.symptom} style={{ background: '#fff', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', color: '#c62828' }}>
                        {s.symptom} ({s.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Log form */}
          <div style={s.card}>
            <h4 style={{ color: '#c62828', marginBottom: '0.75rem' }}>📅 Log Your Period</h4>
            <form onSubmit={handleLogPeriod} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={s.label}>Start Date *</label>
                  <input type="date" value={periodForm.startDate} required
                    onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>End Date</label>
                  <input type="date" value={periodForm.endDate}
                    onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })} style={s.input} />
                </div>
              </div>

              <div>
                <label style={s.label}>Flow</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {FLOW_OPTIONS.map((f) => (
                    <button key={f} type="button" onClick={() => setPeriodForm({ ...periodForm, flow: f })}
                      style={{ ...s.flowBtn, ...(periodForm.flow === f ? { background: '#c62828', color: '#fff' } : {}) }}>
                      {f === 'light' ? '💧' : f === 'medium' ? '💧💧' : '💧💧💧'} {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={s.label}>Symptoms</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {symptomsList.map((sym) => (
                    <button key={sym} type="button" onClick={() => toggleSymptom(sym)}
                      style={{ ...s.symptomBtn, ...(periodForm.symptoms.includes(sym) ? { background: '#ef9a9a', color: '#fff', borderColor: '#ef9a9a' } : {}) }}>
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <textarea placeholder="Notes (optional)" value={periodForm.notes} rows={2}
                onChange={(e) => setPeriodForm({ ...periodForm, notes: e.target.value })}
                style={{ ...s.input, resize: 'vertical' }} />
              <button type="submit" style={s.btn}>Log Period 💗</button>
            </form>
          </div>

          {/* Past logs */}
          <h4 style={{ color: '#c62828', marginTop: '1rem', marginBottom: '0.5rem' }}>Past Periods</h4>
          {periodLogs.length === 0 && <p style={s.empty}>No periods logged yet. Start tracking above!</p>}
          {periodLogs.map((l) => (
            <div key={l._id} style={{ ...s.card, borderLeft: '4px solid #ef5350' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#c62828' }}>{l.startDate}</strong>
                  {l.endDate && <span style={{ color: '#888' }}> → {l.endDate}</span>}
                  {l.durationDays && <span style={{ color: '#aaa', marginLeft: '0.5rem' }}>({l.durationDays}d)</span>}
                </div>
                <span style={{ ...s.badge, background: l.flow === 'light' ? '#e8f5e9' : l.flow === 'heavy' ? '#ffebee' : '#fff3e0' }}>
                  {l.flow}
                </span>
              </div>
              {l.symptoms.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.4rem' }}>
                  {l.symptoms.map((sym) => <span key={sym} style={s.badge}>{sym}</span>)}
                </div>
              )}
              {l.notes && <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.3rem' }}>{l.notes}</p>}
              <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.3rem' }}>Next predicted: {l.predictedNext}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── TIPS TAB ── */}
      {tab === 'tips' && (
        <div>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {TIP_CATEGORIES.map((c) => (
              <button key={c} onClick={() => setTipCategory(c)}
                style={{ ...s.filterBtn, ...(tipCategory === c ? { background: '#c62828', color: '#fff' } : {}) }}>
                {c === 'all' ? '🌟 All' : c === 'nutrition' ? '🥬 Nutrition' : c === 'fitness' ? '💪 Fitness' :
                 c === 'menstrual' ? '📅 Menstrual' : c === 'mental' ? '💜 Mental' : '🌿 Lifestyle'}
              </button>
            ))}
          </div>
          {tips.map((t) => (
            <div key={t.id} style={s.card}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                <div>
                  <strong style={{ color: '#c62828' }}>{t.title}</strong>
                  <p style={{ color: '#555', margin: '0.25rem 0 0', lineHeight: 1.6, fontSize: '0.9rem' }}>{t.tip}</p>
                  <span style={{ ...s.badge, marginTop: '0.3rem' }}>#{t.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CLINICS TAB ── */}
      {tab === 'clinics' && (
        <div>
          <div style={{ ...s.card, background: '#fce4ec', textAlign: 'center' }}>
            <p style={{ color: '#c62828' }}>🏥 Find verified clinics, hospitals, and healthcare centers near you.</p>
          </div>
          {clinics.map((c) => (
            <div key={c.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ color: '#c62828', margin: '0 0 0.25rem' }}>{c.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>{c.speciality}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#f57f17', fontWeight: 600 }}>⭐ {c.rating}</div>
                  <span style={{ ...s.badge, background: c.open ? '#e8f5e9' : '#ffebee', color: c.open ? '#2e7d32' : '#c62828' }}>
                    {c.open ? '🟢 Open' : '🔴 Closed'}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                <div>📍 {c.address}</div>
                <div>📞 {c.phone}</div>
                <div>🕐 {c.timings} · {c.distance}</div>
              </div>
              <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.3rem' }}>
                <span style={s.badge}>{c.type}</span>
                <a href={`tel:${c.phone}`} style={{ ...s.badge, background: '#e8f5e9', color: '#2e7d32', textDecoration: 'none' }}>📞 Call</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TELECONSULT TAB ── */}
      {tab === 'teleconsult' && (
        <div>
          <div style={{ ...s.card, background: '#fce4ec', textAlign: 'center' }}>
            <p style={{ color: '#c62828' }}>📱 Consult qualified doctors securely from the comfort of your home.</p>
          </div>

          {/* Booking modal */}
          {bookingDoctor && (
            <div style={{ ...s.card, background: '#e8f5e9', borderLeft: '4px solid #4caf50' }}>
              <h4 style={{ color: '#2e7d32', margin: '0 0 0.5rem' }}>Book with {bookingDoctor.name}</h4>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                {bookingDoctor.speciality} · Fee: ₹{bookingDoctor.fee} · Next: {bookingDoctor.nextSlot}
              </div>
              <textarea placeholder="Describe your concern (optional)" value={bookNotes}
                onChange={(e) => setBookNotes(e.target.value)} rows={2} style={{ ...s.input, resize: 'vertical', marginBottom: '0.5rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleBookConsult(bookingDoctor)} style={s.btn}>Confirm Booking ✓</button>
                <button onClick={() => setBookingDoctor(null)} style={{ ...s.btn, background: '#888' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Doctor list */}
          <h4 style={{ color: '#c62828', margin: '0.5rem 0' }}>Available Doctors</h4>
          {doctors.map((d) => (
            <div key={d.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ color: '#c62828', margin: '0 0 0.2rem' }}>{d.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>{d.speciality} · {d.experience}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#f57f17', fontWeight: 600 }}>⭐ {d.rating}</div>
                  <div style={{ fontWeight: 700, color: '#2e7d32' }}>₹{d.fee}</div>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                {d.languages.map((l) => <span key={l} style={s.badge}>{l}</span>)}
                <span style={{ ...s.badge, background: '#e8f5e9', color: '#2e7d32' }}>🕐 {d.nextSlot}</span>
                <button onClick={() => setBookingDoctor(d)}
                  style={{ ...s.btn, padding: '0.3rem 0.75rem', fontSize: '0.8rem', marginLeft: 'auto' }}>
                  Book Now 📱
                </button>
              </div>
            </div>
          ))}

          {/* My consultations */}
          {consults.length > 0 && (
            <>
              <h4 style={{ color: '#c62828', margin: '1rem 0 0.5rem' }}>My Consultations</h4>
              {consults.map((c) => (
                <div key={c._id} style={{ ...s.card, borderLeft: `4px solid ${c.status === 'scheduled' ? '#1565c0' : c.status === 'completed' ? '#4caf50' : '#888'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{c.doctorName}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#888' }}>{c.speciality}</div>
                    </div>
                    <span style={{ ...s.badge,
                      background: c.status === 'scheduled' ? '#e3f2fd' : c.status === 'cancelled' ? '#ffebee' : '#e8f5e9',
                      color: c.status === 'scheduled' ? '#1565c0' : c.status === 'cancelled' ? '#c62828' : '#2e7d32',
                    }}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.3rem' }}>
                    📅 {new Date(c.scheduledAt).toLocaleString()}
                  </div>
                  {c.notes && <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>💬 {c.notes}</div>}
                  {c.status === 'scheduled' && (
                    <button onClick={() => handleCancelConsult(c._id)}
                      style={{ marginTop: '0.4rem', background: 'none', border: '1px solid #ef5350', color: '#c62828', padding: '0.25rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── WORKOUT TAB ── */}
      {tab === 'workout' && !activeWorkout && (
        <div>
          {wkStats && (
            <div style={{ ...s.card, background: '#fce4ec' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div><div style={{ fontWeight: 700, color: '#c62828', fontSize: '1.3rem' }}>{wkStats.sessionsThisWeek}</div><small>Workouts (7d)</small></div>
                <div><div style={{ fontWeight: 700, color: '#c62828', fontSize: '1.3rem' }}>{wkStats.minutesThisWeek}</div><small>Minutes</small></div>
                <div><div style={{ fontWeight: 700, color: '#c62828', fontSize: '1.3rem' }}>{wkStats.caloriesThisWeek}</div><small>Calories</small></div>
                <div><div style={{ fontWeight: 700, color: '#c62828', fontSize: '1.3rem' }}>🔥 {wkStats.streak}</div><small>Streak</small></div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['all', 'yoga', 'hiit', 'strength', 'cardio', 'period-friendly'].map((c) => (
              <button key={c} onClick={() => setWkCategory(c)}
                style={{ ...s.filterBtn, ...(wkCategory === c ? { background: '#c62828', color: '#fff' } : {}) }}>
                {c === 'all' ? '🌟 All' : c === 'yoga' ? '🧘 Yoga' : c === 'hiit' ? '⚡ HIIT' :
                 c === 'strength' ? '💪 Strength' : c === 'cardio' ? '🏃 Cardio' : '🌸 Period-Friendly'}
              </button>
            ))}
          </div>

          {workouts.map((w) => (
            <div key={w.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ color: '#c62828', margin: '0 0 0.2rem' }}>{w.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>{w.description}</div>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                <span style={s.badge}>⏱ {w.durationMin} min</span>
                <span style={s.badge}>🔥 {w.caloriesBurned} cal</span>
                <span style={{ ...s.badge, background: '#fff3e0', color: '#e65100' }}>{w.difficulty}</span>
                <span style={{ ...s.badge, background: '#e8f5e9' }}>#{w.category}</span>
                <button onClick={() => { setActiveWorkout(w); setExStep(0); }}
                  style={{ ...s.btn, padding: '0.3rem 0.75rem', fontSize: '0.8rem', marginLeft: 'auto' }}>
                  Start 💪
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active workout session */}
      {tab === 'workout' && activeWorkout && (
        <div style={{ ...s.card, background: 'linear-gradient(180deg, #fce4ec 0%, #fff 100%)', textAlign: 'center' }}>
          <h3 style={{ color: '#c62828' }}>{activeWorkout.title}</h3>
          <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>
            ⏱ {activeWorkout.durationMin} min · 🔥 {activeWorkout.caloriesBurned} cal
          </div>
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 12px rgba(198,40,40,0.08)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💪</div>
            <h4 style={{ color: '#c62828', margin: '0 0 0.25rem' }}>
              {activeWorkout.exercises[exStep].name}
            </h4>
            <div style={{ color: '#666' }}>
              {activeWorkout.exercises[exStep].reps} · {activeWorkout.exercises[exStep].duration}
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
            Exercise {exStep + 1} of {activeWorkout.exercises.length}
          </div>
          <div style={{ background: '#ef9a9a', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ height: '100%', background: '#c62828', borderRadius: '3px', width: `${((exStep + 1) / activeWorkout.exercises.length) * 100}%`, transition: 'width 0.3s' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {exStep > 0 && <button onClick={() => setExStep(exStep - 1)} style={{ ...s.btn, background: '#ef9a9a' }}>← Prev</button>}
            {exStep < activeWorkout.exercises.length - 1 ? (
              <button onClick={() => setExStep(exStep + 1)} style={s.btn}>Next →</button>
            ) : (
              <button onClick={() => handleCompleteWorkout(activeWorkout.id)} style={{ ...s.btn, background: '#2e7d32' }}>✓ Complete!</button>
            )}
          </div>
          <button onClick={() => { setActiveWorkout(null); setExStep(0); }}
            style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      {/* ── PLANNER TAB ── */}
      {tab === 'planner' && (
        <div>
          <div style={{ ...s.card, background: '#fce4ec', textAlign: 'center' }}>
            <p style={{ color: '#c62828' }}>🗓️ Plan your weekly workouts. Consistency is key!</p>
          </div>

          {/* Suggested plans */}
          <div style={{ ...s.card, display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>Load a suggested plan:</span>
            <button onClick={() => handleLoadSuggested('beginner')} style={{ ...s.btn, padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>🌱 Beginner</button>
            <button onClick={() => handleLoadSuggested('intermediate')} style={{ ...s.btn, padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#e65100' }}>🔥 Intermediate</button>
          </div>

          {/* Add entry */}
          <details style={s.card}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#c62828' }}>+ Add to planner</summary>
            <form onSubmit={handleAddPlan} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              <select value={planForm.day} onChange={(e) => setPlanForm({ ...planForm, day: e.target.value })} style={s.input}>
                {DAYS.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
              <input placeholder="Workout title (e.g. Morning Yoga)" value={planForm.title}
                onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })} required style={s.input} />
              <input type="time" value={planForm.time}
                onChange={(e) => setPlanForm({ ...planForm, time: e.target.value })} style={s.input} />
              <input placeholder="Notes (optional)" value={planForm.notes}
                onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })} style={s.input} />
              <button type="submit" style={s.btn}>Add to Plan</button>
            </form>
          </details>

          {/* Weekly plan display */}
          {DAYS.map((day) => {
            const dayEntries = planner.filter((p) => p.day === day);
            return (
              <div key={day} style={{ ...s.card, borderLeft: dayEntries.length > 0 ? '4px solid #4caf50' : '4px solid #e0e0e0' }}>
                <h4 style={{ color: '#c62828', margin: '0 0 0.25rem', textTransform: 'capitalize' }}>{day}</h4>
                {dayEntries.length === 0 && <span style={{ color: '#ccc', fontSize: '0.85rem' }}>Rest day / No plan</span>}
                {dayEntries.map((p) => (
                  <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0', borderBottom: '1px solid #f5f5f5' }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>{p.title}</span>
                      {p.time && <span style={{ color: '#888', marginLeft: '0.5rem', fontSize: '0.8rem' }}>🕐 {p.time}</span>}
                      {p.notes && <span style={{ color: '#aaa', marginLeft: '0.5rem', fontSize: '0.8rem' }}>— {p.notes}</span>}
                    </div>
                    <button onClick={() => handleDeletePlan(p._id)} style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ── COACHES TAB ── */}
      {tab === 'coaches' && (
        <div>
          <div style={{ ...s.card, background: '#fce4ec', textAlign: 'center' }}>
            <p style={{ color: '#c62828' }}>🏃‍♀️ Find certified women fitness coaches and studios near you.</p>
          </div>
          {coaches.map((co) => (
            <div key={co.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ color: '#c62828', margin: '0 0 0.2rem' }}>{co.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>Coach: {co.coach} · {co.experience}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{co.speciality}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#f57f17', fontWeight: 600 }}>⭐ {co.rating}</div>
                  <div style={{ fontWeight: 700, color: '#2e7d32', fontSize: '0.85rem' }}>{co.fee}</div>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                <div>📍 {co.address} · {co.distance}</div>
                <div>🕐 {co.timings}</div>
                <div>📞 {co.phone}</div>
              </div>
              <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {co.certified && <span style={{ ...s.badge, background: '#e8f5e9', color: '#2e7d32' }}>✅ Certified</span>}
                <span style={s.badge}>👩 {co.gender}-only</span>
                <a href={`tel:${co.phone}`} style={{ ...s.badge, background: '#e3f2fd', color: '#1565c0', textDecoration: 'none' }}>📞 Call</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const s = {
  wrapper: { padding: '2rem 1rem', minHeight: 'calc(100vh - 60px)', background: '#fff5f5', maxWidth: '700px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#c62828', fontSize: '1rem', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 600 },
  hero: { textAlign: 'center', background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', padding: '2rem', borderRadius: '16px', marginBottom: '1.5rem' },
  heroTitle: { color: '#c62828', margin: '0.25rem 0', fontSize: '1.6rem' },
  heroTagline: { color: '#c62828', fontWeight: 600, fontSize: '1.1rem', margin: '0.25rem 0' },
  heroDesc: { color: '#666', lineHeight: 1.7, margin: '0.75rem 0 0', fontSize: '0.95rem' },
  tabs: { display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.5rem 0.75rem', border: '1px solid #ef9a9a', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 },
  tabActive: { background: '#c62828', color: '#fff', borderColor: '#c62828' },
  card: { background: '#fff', padding: '1rem 1.25rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(198,40,40,0.06)', marginBottom: '0.75rem' },
  input: { padding: '0.6rem 0.75rem', border: '1px solid #ef9a9a', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  label: { display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem', fontWeight: 500 },
  btn: { padding: '0.6rem 1rem', background: '#c62828', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' },
  flowBtn: { padding: '0.4rem 0.75rem', border: '1px solid #ef9a9a', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'capitalize' },
  symptomBtn: { padding: '0.25rem 0.5rem', border: '1px solid #ef9a9a', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontSize: '0.75rem' },
  filterBtn: { padding: '0.4rem 0.75rem', border: '1px solid #ef9a9a', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '0.8rem' },
  badge: { display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '12px', background: '#fce4ec', color: '#c62828', fontSize: '0.75rem', fontWeight: 500 },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  error: { background: '#ffebee', color: '#c62828', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  empty: { textAlign: 'center', color: '#aaa', padding: '2rem', fontStyle: 'italic' },
};

export default HerSwasthya;
