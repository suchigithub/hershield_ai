import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import hershantiService from '../services/hershantiService';

const MOOD_EMOJIS = {
  happy: '😊', calm: '😌', anxious: '😰', sad: '😢', angry: '😡',
  grateful: '🙏', tired: '😴', hopeful: '🌟', overwhelmed: '😩', neutral: '😐',
};

const TABS = ['home', 'journal', 'meditate', 'therapists', 'groups'];

const HerShanti = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('home');

  // ── Home ──
  const [daily, setDaily] = useState(null);

  // ── Mood Journal ──
  const [entries, setEntries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [moodForm, setMoodForm] = useState({ mood: '', intensity: 3, note: '' });
  const [moodResponse, setMoodResponse] = useState(null);

  // ── Meditation ──
  const [sessions, setSessions] = useState([]);
  const [activeMed, setActiveMed] = useState(null);
  const [medStep, setMedStep] = useState(0);
  const [medStats, setMedStats] = useState(null);

  // ── Therapists ──
  const [therapists, setTherapists] = useState([]);

  // ── Groups ──
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [groupMsgs, setGroupMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [groupForm, setGroupForm] = useState({ name: '', description: '', category: '' });

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const flash = (m, isErr = false) => {
    if (isErr) { setErr(m); setMsg(''); } else { setMsg(m); setErr(''); }
    setTimeout(() => { setMsg(''); setErr(''); }, 4000);
  };

  const loadDaily = useCallback(async () => {
    try { const { data } = await hershantiService.getDailyWellness(); setDaily(data); } catch {}
  }, []);
  const loadEntries = useCallback(async () => {
    try {
      const [eRes, aRes] = await Promise.all([hershantiService.getMoodEntries(), hershantiService.getMoodAnalytics(30)]);
      setEntries(eRes.data.entries);
      setAnalytics(aRes.data.analytics);
    } catch {}
  }, []);
  const loadSessions = useCallback(async () => {
    try {
      const [sRes, stRes] = await Promise.all([hershantiService.getMeditations(), hershantiService.getMeditationStats()]);
      setSessions(sRes.data.sessions);
      setMedStats(stRes.data.stats);
    } catch {}
  }, []);
  const loadTherapists = useCallback(async () => {
    try { const { data } = await hershantiService.getTherapists({ available: true }); setTherapists(data.therapists); } catch {}
  }, []);
  const loadGroups = useCallback(async () => {
    try { const { data } = await hershantiService.getGroups(); setGroups(data.groups); } catch {}
  }, []);

  useEffect(() => {
    if (tab === 'home') loadDaily();
    if (tab === 'journal') loadEntries();
    if (tab === 'meditate') loadSessions();
    if (tab === 'therapists') loadTherapists();
    if (tab === 'groups') loadGroups();
  }, [tab, loadDaily, loadEntries, loadSessions, loadTherapists, loadGroups]);

  // ── Handlers ──
  const handleLogMood = async (e) => {
    e.preventDefault();
    try {
      const { data } = await hershantiService.createMoodEntry({ ...moodForm, intensity: Number(moodForm.intensity) });
      setMoodResponse(data);
      setMoodForm({ mood: '', intensity: 3, note: '' });
      loadEntries();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleCompleteMeditation = async (sessionId) => {
    try {
      const { data } = await hershantiService.completeMeditation(sessionId);
      flash(data.message);
      setActiveMed(null);
      setMedStep(0);
      loadSessions();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleJoinGroup = async (id) => {
    try { await hershantiService.joinGroup(id); flash('Welcome to the group! 🤝'); loadGroups(); } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleOpenGroup = async (group) => {
    setActiveGroup(group);
    try { const { data } = await hershantiService.getGroupMessages(group._id); setGroupMsgs(data.messages); }
    catch { setGroupMsgs([]); }
  };

  const handleSendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      await hershantiService.postGroupMessage(activeGroup._id, newMsg);
      setNewMsg('');
      const { data } = await hershantiService.getGroupMessages(activeGroup._id);
      setGroupMsgs(data.messages);
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await hershantiService.createGroup(groupForm);
      setGroupForm({ name: '', description: '', category: '' });
      flash('Group created!');
      loadGroups();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  return (
    <div style={s.wrapper}>
      <button onClick={() => navigate('/dashboard')} style={s.back}>← Dashboard</button>
      <h2 style={s.title}>🧘 HerShanti — Mental Wellness</h2>
      <p style={s.subtitle}>A safe, compassionate space for your emotional well-being.</p>

      {msg && <div style={s.success}>{msg}</div>}
      {err && <div style={s.error}>{err}</div>}

      {/* Tab bar */}
      <div className="tab-bar" style={s.tabs}>
        {TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); setActiveMed(null); setActiveGroup(null); setMoodResponse(null); }}
            style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
            {t === 'home' ? '🏠 Home' : t === 'journal' ? '📝 Journal' : t === 'meditate' ? '🧘 Meditate' :
             t === 'therapists' ? '👩‍⚕️ Therapists' : '🤝 Groups'}
          </button>
        ))}
      </div>

      {/* ── HOME TAB ── */}
      {tab === 'home' && daily && (
        <div>
          <div style={{ ...s.card, background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💜</div>
            <p style={{ color: '#6a1b9a', fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              "{daily.affirmation}"
            </p>
            <small style={{ color: '#8e24aa' }}>{daily.greeting}</small>
          </div>
          <div style={s.card}>
            <h4 style={{ color: '#6a1b9a' }}>📝 Today's Reflection</h4>
            <p style={{ color: '#555', lineHeight: 1.6, marginTop: '0.5rem' }}>{daily.reflectionPrompt}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ ...s.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🧘</div>
              <div style={{ fontWeight: 700, color: '#6a1b9a', fontSize: '1.5rem' }}>{daily.meditationStats.totalSessions}</div>
              <small style={{ color: '#888' }}>Meditations</small>
            </div>
            <div style={{ ...s.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>📝</div>
              <div style={{ fontWeight: 700, color: '#6a1b9a', fontSize: '1.5rem' }}>{daily.weeklyMood.totalEntries}</div>
              <small style={{ color: '#888' }}>Journal entries (7d)</small>
            </div>
            <div style={{ ...s.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🔥</div>
              <div style={{ fontWeight: 700, color: '#6a1b9a', fontSize: '1.5rem' }}>{daily.weeklyMood.journalStreak}</div>
              <small style={{ color: '#888' }}>Day streak</small>
            </div>
            <div style={{ ...s.card, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>{MOOD_EMOJIS[daily.weeklyMood.dominantMood] || '😐'}</div>
              <div style={{ fontWeight: 600, color: '#6a1b9a', fontSize: '0.95rem', textTransform: 'capitalize' }}>{daily.weeklyMood.dominantMood}</div>
              <small style={{ color: '#888' }}>Dominant mood</small>
            </div>
          </div>
        </div>
      )}

      {/* ── JOURNAL TAB ── */}
      {tab === 'journal' && (
        <div>
          {/* Mood picker */}
          <div style={s.card}>
            <h4 style={{ color: '#6a1b9a', marginBottom: '0.75rem' }}>How are you feeling?</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {Object.entries(MOOD_EMOJIS).map(([mood, emoji]) => (
                <button key={mood} onClick={() => setMoodForm({ ...moodForm, mood })}
                  style={{ ...s.moodBtn, ...(moodForm.mood === mood ? { background: '#ce93d8', color: '#fff' } : {}) }}>
                  {emoji} {mood}
                </button>
              ))}
            </div>
            {moodForm.mood && (
              <form onSubmit={handleLogMood} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#666' }}>
                  Intensity: {moodForm.intensity}/5
                  <input type="range" min="1" max="5" value={moodForm.intensity}
                    onChange={(e) => setMoodForm({ ...moodForm, intensity: e.target.value })}
                    style={{ width: '100%', accentColor: '#6a1b9a' }} />
                </label>
                <textarea placeholder="What's on your mind? (optional, this is your safe space...)"
                  value={moodForm.note} onChange={(e) => setMoodForm({ ...moodForm, note: e.target.value })}
                  rows={3} style={{ ...s.input, resize: 'vertical' }} />
                <button type="submit" style={s.btn}>Log mood 💜</button>
              </form>
            )}
          </div>

          {/* Mood response */}
          {moodResponse && (
            <div style={{ ...s.card, background: '#f3e5f5', borderLeft: '4px solid #6a1b9a' }}>
              <p style={{ fontStyle: 'italic', color: '#6a1b9a', marginBottom: '0.5rem' }}>"{moodResponse.affirmation}"</p>
              <p style={{ color: '#555', lineHeight: 1.6 }}>💭 <strong>Reflect:</strong> {moodResponse.reflectionPrompt}</p>
            </div>
          )}

          {/* Analytics */}
          {analytics && analytics.totalEntries > 0 && (
            <div style={s.card}>
              <h4 style={{ color: '#6a1b9a', marginBottom: '0.5rem' }}>Your Mood Patterns (30 days)</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Object.entries(analytics.moodDistribution).map(([mood, count]) => (
                  <span key={mood} style={{ background: '#f3e5f5', padding: '0.4rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', color: '#6a1b9a' }}>
                    {MOOD_EMOJIS[mood]} {mood}: {count}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
                🔥 Streak: {analytics.journalStreak} day(s) · Avg intensity: {analytics.averageIntensity}/5
              </div>
            </div>
          )}

          {/* Past entries */}
          {entries.slice(0, 15).map((e) => (
            <div key={e._id} style={{ ...s.card, borderLeft: '4px solid #ce93d8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem' }}>{MOOD_EMOJIS[e.mood]} <strong style={{ textTransform: 'capitalize' }}>{e.mood}</strong>
                  <small style={{ marginLeft: '0.5rem', color: '#aaa' }}>({e.intensity}/5)</small></span>
                <small style={{ color: '#aaa' }}>{e.date}</small>
              </div>
              {e.note && <p style={{ color: '#666', marginTop: '0.4rem', fontSize: '0.9rem', lineHeight: 1.5 }}>{e.note}</p>}
            </div>
          ))}
          {entries.length === 0 && <p style={s.empty}>No journal entries yet. Start by logging how you feel above. 💜</p>}
        </div>
      )}

      {/* ── MEDITATE TAB ── */}
      {tab === 'meditate' && !activeMed && (
        <div>
          {medStats && (
            <div style={{ ...s.card, background: '#f3e5f5', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div><div style={{ fontWeight: 700, color: '#6a1b9a', fontSize: '1.3rem' }}>{medStats.totalSessions}</div><small>Sessions</small></div>
              <div><div style={{ fontWeight: 700, color: '#6a1b9a', fontSize: '1.3rem' }}>{medStats.totalMinutes}</div><small>Minutes</small></div>
              <div><div style={{ fontWeight: 700, color: '#6a1b9a', fontSize: '1.3rem' }}>{medStats.averageMinutes}</div><small>Avg min</small></div>
            </div>
          )}
          {sessions.map((session) => (
            <div key={session.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ color: '#6a1b9a', margin: 0 }}>{session.title}</h4>
                <span style={s.badge}>{session.durationMin} min</span>
              </div>
              <p style={{ color: '#666', margin: '0.5rem 0', lineHeight: 1.5, fontSize: '0.9rem' }}>{session.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ ...s.badge, background: '#ede7f6' }}>#{session.category}</span>
                <button onClick={() => { setActiveMed(session); setMedStep(0); }} style={{ ...s.btn, padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                  Begin 🧘
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active meditation session */}
      {tab === 'meditate' && activeMed && (
        <div style={{ ...s.card, background: 'linear-gradient(180deg, #f3e5f5 0%, #fff 100%)', textAlign: 'center' }}>
          <h3 style={{ color: '#6a1b9a' }}>{activeMed.title}</h3>
          <div style={{ margin: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧘</div>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 12px rgba(106,27,154,0.1)', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#333', fontSize: '1.1rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                {activeMed.steps[medStep]}
              </p>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
              Step {medStep + 1} of {activeMed.steps.length}
            </div>
            <div style={s.progressBg}>
              <div style={{ ...s.progressFill, width: `${((medStep + 1) / activeMed.steps.length) * 100}%` }}></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {medStep > 0 && (
              <button onClick={() => setMedStep(medStep - 1)} style={{ ...s.btn, background: '#ce93d8' }}>← Previous</button>
            )}
            {medStep < activeMed.steps.length - 1 ? (
              <button onClick={() => setMedStep(medStep + 1)} style={s.btn}>Next →</button>
            ) : (
              <button onClick={() => handleCompleteMeditation(activeMed.id)} style={{ ...s.btn, background: '#2e7d32' }}>
                ✓ Complete
              </button>
            )}
          </div>
          <button onClick={() => { setActiveMed(null); setMedStep(0); }}
            style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      {/* ── THERAPISTS TAB ── */}
      {tab === 'therapists' && (
        <div>
          <div style={{ ...s.card, background: '#f3e5f5', textAlign: 'center' }}>
            <p style={{ color: '#6a1b9a' }}>It's brave to ask for help. These professionals are here for you. 💜</p>
          </div>
          {therapists.map((t) => (
            <div key={t.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ color: '#6a1b9a', margin: '0 0 0.25rem' }}>{t.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>{t.speciality} · {t.experience}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#f57f17', fontWeight: 600 }}>⭐ {t.rating}</div>
                  <span style={{ ...s.badge, background: t.available ? '#e8f5e9' : '#ffebee', color: t.available ? '#2e7d32' : '#c62828' }}>
                    {t.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={s.badge}>📍 {t.city}</span>
                <span style={s.badge}>💻 {t.mode}</span>
                {t.languages.map((l) => <span key={l} style={{ ...s.badge, background: '#ede7f6' }}>{l}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── GROUPS TAB ── */}
      {tab === 'groups' && !activeGroup && (
        <div>
          <div style={{ ...s.card, background: '#f3e5f5', textAlign: 'center' }}>
            <p style={{ color: '#6a1b9a' }}>You are not alone. Connect with women who understand. 🤝</p>
          </div>
          <details style={s.card}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#6a1b9a' }}>+ Create a new group</summary>
            <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              <input placeholder="Group name" value={groupForm.name}
                onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} required style={s.input} />
              <input placeholder="Description" value={groupForm.description}
                onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })} style={s.input} />
              <input placeholder="Category (anxiety, motherhood...)" value={groupForm.category}
                onChange={(e) => setGroupForm({ ...groupForm, category: e.target.value })} style={s.input} />
              <button type="submit" style={s.btn}>Create Group</button>
            </form>
          </details>
          {groups.map((g) => (
            <div key={g._id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#6a1b9a', margin: '0 0 0.25rem' }}>{g.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>{g.description}</div>
                </div>
                <span style={s.badge}>{g.memberCount} members</span>
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ ...s.badge, background: '#ede7f6' }}>#{g.category}</span>
                <button onClick={() => handleJoinGroup(g._id)} style={{ ...s.btn, padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Join</button>
                <button onClick={() => handleOpenGroup(g)} style={{ ...s.btn, padding: '0.3rem 0.75rem', fontSize: '0.8rem', background: '#8e24aa' }}>Open Chat</button>
              </div>
            </div>
          ))}
          {groups.length === 0 && <p style={s.empty}>No groups yet. Create the first one! 💜</p>}
        </div>
      )}

      {/* Active group chat */}
      {tab === 'groups' && activeGroup && (
        <div>
          <button onClick={() => setActiveGroup(null)} style={{ ...s.back, marginBottom: '0.5rem' }}>← Back to Groups</button>
          <div style={{ ...s.card, background: '#f3e5f5' }}>
            <h4 style={{ color: '#6a1b9a', margin: 0 }}>{activeGroup.name}</h4>
            <small style={{ color: '#888' }}>{activeGroup.description}</small>
          </div>
          <div style={{ ...s.card, maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {groupMsgs.length === 0 && <p style={s.empty}>No messages yet. Break the ice! 💜</p>}
            {groupMsgs.map((m) => (
              <div key={m._id} style={{ background: '#fafafa', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                <strong style={{ color: '#6a1b9a', fontSize: '0.85rem' }}>{m.userName}</strong>
                <span style={{ float: 'right', fontSize: '0.75rem', color: '#bbb' }}>{new Date(m.createdAt).toLocaleTimeString()}</span>
                <p style={{ margin: '0.25rem 0 0', color: '#444', fontSize: '0.9rem' }}>{m.message}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input placeholder="Type a message..." value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} style={{ ...s.input, flex: 1 }} />
            <button onClick={handleSendMessage} style={{ ...s.btn, padding: '0.5rem 1rem' }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  wrapper: { padding: '2rem 1rem', minHeight: 'calc(100vh - 60px)', background: '#faf5ff', maxWidth: '700px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#6a1b9a', fontSize: '1rem', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 600 },
  title: { color: '#6a1b9a', marginBottom: '0.25rem' },
  subtitle: { color: '#888', marginBottom: '1.25rem', fontSize: '0.95rem' },
  tabs: { display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.5rem 0.75rem', border: '1px solid #e1bee7', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 },
  tabActive: { background: '#6a1b9a', color: '#fff', borderColor: '#6a1b9a' },
  card: { background: '#fff', padding: '1rem 1.25rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(106,27,154,0.06)', marginBottom: '0.75rem' },
  input: { padding: '0.6rem 0.75rem', border: '1px solid #e1bee7', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' },
  btn: { padding: '0.6rem 1rem', background: '#6a1b9a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' },
  moodBtn: { padding: '0.5rem 0.75rem', border: '1px solid #e1bee7', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '0.82rem', textTransform: 'capitalize' },
  badge: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '12px', background: '#f3e5f5', color: '#6a1b9a', fontSize: '0.75rem', fontWeight: 500 },
  progressBg: { background: '#e1bee7', height: '6px', borderRadius: '3px', margin: '0.75rem 0', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#6a1b9a', borderRadius: '3px', transition: 'width 0.3s' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  error: { background: '#ffebee', color: '#c62828', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  empty: { textAlign: 'center', color: '#aaa', padding: '2rem', fontStyle: 'italic' },
};

export default HerShanti;
