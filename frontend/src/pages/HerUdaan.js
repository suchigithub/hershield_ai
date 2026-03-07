import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import herudaanService from '../services/herudaanService';

const TABS = ['resume', 'courses', 'studies', 'jobs', 'mentors', 'community'];

const HerUdaan = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('resume');

  const [resumes, setResumes] = useState([]);
  const [rForm, setRForm] = useState({ name: '', email: '', phone: '', summary: '', skills: '' });
  const [editingId, setEditingId] = useState(null);

  const [courses, setCourses] = useState([]);
  const [courseCat, setCourseCat] = useState('all');

  const [studies, setStudies] = useState([]);

  const [jobs, setJobs] = useState([]);
  const [jobFilter, setJobFilter] = useState('all');

  const [mentors, setMentors] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectMsg, setConnectMsg] = useState('');
  const [connectingId, setConnectingId] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ title: '', content: '', category: 'career' });
  const [replyText, setReplyText] = useState({});

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const flash = (m, isErr = false) => { if (isErr) { setErr(m); setMsg(''); } else { setMsg(m); setErr(''); } setTimeout(() => { setMsg(''); setErr(''); }, 4000); };

  const loadResumes = useCallback(async () => { try { const { data } = await herudaanService.getResumes(); setResumes(data.resumes); } catch {} }, []);
  const loadCourses = useCallback(async () => { try { const cat = courseCat === 'all' ? undefined : courseCat; const { data } = await herudaanService.getCourses(cat); setCourses(data.courses); } catch {} }, [courseCat]);
  const loadStudies = useCallback(async () => { try { const { data } = await herudaanService.getHigherStudies(); setStudies(data.programs); } catch {} }, []);
  const loadJobs = useCallback(async () => { try { const params = {}; if (jobFilter === 'remote') params.remote = true; else if (jobFilter === 'return') params.returnFriendly = true; else if (jobFilter !== 'all') params.type = jobFilter; const { data } = await herudaanService.getJobs(params); setJobs(data.jobs); } catch {} }, [jobFilter]);
  const loadMentors = useCallback(async () => { try { const [mRes, cRes] = await Promise.all([herudaanService.getMentors({ available: true }), herudaanService.getMyConnections()]); setMentors(mRes.data.mentors); setConnections(cRes.data.connections); } catch {} }, []);
  const loadCommunity = useCallback(async () => { try { const [pRes, postsRes] = await Promise.all([herudaanService.getPrograms(), herudaanService.getPosts()]); setPrograms(pRes.data.programs); setPosts(postsRes.data.posts); } catch {} }, []);

  useEffect(() => {
    if (tab === 'resume') loadResumes();
    if (tab === 'courses') loadCourses();
    if (tab === 'studies') loadStudies();
    if (tab === 'jobs') loadJobs();
    if (tab === 'mentors') loadMentors();
    if (tab === 'community') loadCommunity();
  }, [tab, loadResumes, loadCourses, loadStudies, loadJobs, loadMentors, loadCommunity]);
  useEffect(() => { if (tab === 'courses') loadCourses(); }, [courseCat, loadCourses, tab]);
  useEffect(() => { if (tab === 'jobs') loadJobs(); }, [jobFilter, loadJobs, tab]);

  const handleCreateResume = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...rForm, skills: rForm.skills.split(',').map((s) => s.trim()).filter(Boolean) };
      if (editingId) { await herudaanService.updateResume(editingId, payload); flash('Resume updated!'); setEditingId(null); }
      else { await herudaanService.createResume(payload); flash('Resume created! 📄'); }
      setRForm({ name: '', email: '', phone: '', summary: '', skills: '' });
      loadResumes();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const editResume = (r) => { setEditingId(r._id); setRForm({ name: r.name, email: r.email, phone: r.phone, summary: r.summary, skills: (r.skills || []).join(', ') }); };

  const handleConnect = async (mentorId) => {
    try { const { data } = await herudaanService.connectMentor({ mentorId, message: connectMsg }); flash(data.message); setConnectingId(null); setConnectMsg(''); loadMentors(); }
    catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try { await herudaanService.createPost(postForm); setPostForm({ title: '', content: '', category: 'career' }); flash('Post shared! 🤝'); loadCommunity(); }
    catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleReply = async (postId) => {
    if (!replyText[postId]?.trim()) return;
    try { await herudaanService.replyPost(postId, replyText[postId]); setReplyText({ ...replyText, [postId]: '' }); loadCommunity(); }
    catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleLike = async (postId) => { try { await herudaanService.likePost(postId); loadCommunity(); } catch {} };

  return (
    <div style={st.wrapper}>
      <button onClick={() => navigate('/dashboard')} style={st.back}>← Dashboard</button>
      <div style={st.hero}>
        <div style={{ fontSize: '2.5rem' }}>🚀</div>
        <h2 style={st.heroTitle}>HerUdaan — Career Restart & Growth</h2>
        <p style={st.heroTag}>Take flight again. Your career is not over — it's just beginning.</p>
        <p style={st.heroDesc}>Build your resume, upskill, find jobs, connect with mentors, and join a community of ambitious women.</p>
      </div>

      {msg && <div style={st.success}>{msg}</div>}
      {err && <div style={st.error}>{err}</div>}

      <div className="tab-bar" style={st.tabs}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...st.tab, ...(tab === t ? st.tabActive : {}) }}>
            {t === 'resume' ? '📄 Resume' : t === 'courses' ? '📚 Courses' : t === 'studies' ? '🎓 Studies' :
             t === 'jobs' ? '💼 Jobs' : t === 'mentors' ? '🧑‍🏫 Mentors' : '🤝 Community'}
          </button>
        ))}
      </div>

      {/* ── RESUME TAB ── */}
      {tab === 'resume' && (
        <div>
          <div style={st.card}>
            <h4 style={{ color: '#e65100', marginBottom: '0.5rem' }}>{editingId ? '✏️ Edit Resume' : '📄 Create Resume'}</h4>
            <form onSubmit={handleCreateResume} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input placeholder="Full Name *" value={rForm.name} onChange={(e) => setRForm({ ...rForm, name: e.target.value })} required style={st.input} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input placeholder="Email" value={rForm.email} onChange={(e) => setRForm({ ...rForm, email: e.target.value })} style={st.input} />
                <input placeholder="Phone" value={rForm.phone} onChange={(e) => setRForm({ ...rForm, phone: e.target.value })} style={st.input} />
              </div>
              <textarea placeholder="Professional Summary — highlight strengths, experience, and career goals" value={rForm.summary} onChange={(e) => setRForm({ ...rForm, summary: e.target.value })} rows={3} style={{ ...st.input, resize: 'vertical' }} />
              <input placeholder="Skills (comma-separated: Excel, Python, Marketing...)" value={rForm.skills} onChange={(e) => setRForm({ ...rForm, skills: e.target.value })} style={st.input} />
              <button type="submit" style={st.btn}>{editingId ? 'Update Resume' : 'Create Resume'} 📄</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setRForm({ name: '', email: '', phone: '', summary: '', skills: '' }); }} style={{ ...st.btn, background: '#888' }}>Cancel Edit</button>}
            </form>
          </div>
          {resumes.map((r) => (
            <div key={r._id} style={{ ...st.card, borderLeft: '4px solid #e65100' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h4 style={{ color: '#e65100', margin: 0 }}>{r.name}</h4><div style={{ fontSize: '0.85rem', color: '#888' }}>{r.email} · {r.phone}</div></div>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button onClick={() => editResume(r)} style={{ ...st.badge, cursor: 'pointer', border: 'none', background: '#e3f2fd', color: '#1565c0' }}>✏️ Edit</button>
                  <button onClick={async () => { await herudaanService.deleteResume(r._id); loadResumes(); }} style={{ ...st.badge, cursor: 'pointer', border: 'none', background: '#ffebee', color: '#c62828' }}>🗑️</button>
                </div>
              </div>
              {r.summary && <p style={{ color: '#555', margin: '0.5rem 0', lineHeight: 1.5, fontSize: '0.9rem' }}>{r.summary}</p>}
              {r.skills?.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>{r.skills.map((s, i) => <span key={i} style={st.badge}>{s}</span>)}</div>}
              <small style={{ color: '#aaa' }}>Updated: {new Date(r.updatedAt).toLocaleDateString()}</small>
            </div>
          ))}
          {resumes.length === 0 && <p style={st.empty}>No resumes yet. Build your first one above! 📄</p>}
        </div>
      )}

      {/* ── COURSES TAB ── */}
      {tab === 'courses' && (
        <div>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['all', 'tech', 'marketing', 'finance', 'design', 'softskills', 'writing', 'language', 'management'].map((c) => (
              <button key={c} onClick={() => setCourseCat(c)} style={{ ...st.filterBtn, ...(courseCat === c ? { background: '#e65100', color: '#fff' } : {}) }}>
                {c === 'all' ? '🌟 All' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          {courses.map((c) => (
            <div key={c.id} style={st.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><h4 style={{ color: '#e65100', margin: '0 0 0.2rem' }}>{c.title}</h4><div style={{ fontSize: '0.85rem', color: '#888' }}>{c.provider} · {c.duration} · {c.level}</div></div>
                <div>{c.free ? <span style={{ ...st.badge, background: '#e8f5e9', color: '#2e7d32' }}>FREE</span> : <span style={st.badge}>Paid</span>}</div>
              </div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.85rem', lineHeight: 1.5 }}>{c.description}</p>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {c.certificate && <span style={{ ...st.badge, background: '#e3f2fd', color: '#1565c0' }}>🎓 Certificate</span>}
                <span style={st.badge}>#{c.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HIGHER STUDIES TAB ── */}
      {tab === 'studies' && (
        <div>
          <div style={{ ...st.card, background: '#fff3e0', textAlign: 'center' }}>
            <p style={{ color: '#e65100' }}>🎓 Explore advanced education and certification pathways to elevate your career.</p>
          </div>
          {studies.map((h) => (
            <div key={h.id} style={st.card}>
              <h4 style={{ color: '#e65100', margin: '0 0 0.2rem' }}>{h.title}</h4>
              <div style={{ fontSize: '0.85rem', color: '#888' }}>{h.institution} · {h.duration} · {h.mode}</div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.85rem', lineHeight: 1.5 }}>{h.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                <span style={{ ...st.badge, background: '#e8f5e9', color: '#2e7d32' }}>💰 {h.fee}</span>
                <span style={st.badge}>📋 {h.eligibility}</span>
                <span style={{ ...st.badge, background: '#e3f2fd' }}>#{h.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── JOBS TAB ── */}
      {tab === 'jobs' && (
        <div>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['all', 'remote', 'return', 'Full-time', 'Part-time', 'Freelance', 'Internship'].map((f) => (
              <button key={f} onClick={() => setJobFilter(f)} style={{ ...st.filterBtn, ...(jobFilter === f ? { background: '#e65100', color: '#fff' } : {}) }}>
                {f === 'all' ? '🌟 All' : f === 'remote' ? '🏠 Remote' : f === 'return' ? '🔄 Returnee' : f}
              </button>
            ))}
          </div>
          {jobs.map((j) => (
            <div key={j.id} style={{ ...st.card, borderLeft: `4px solid ${j.returnFriendly ? '#4caf50' : '#e65100'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h4 style={{ color: '#e65100', margin: '0 0 0.2rem' }}>{j.title}</h4><div style={{ fontSize: '0.85rem', color: '#888' }}>{j.company} · {j.location} · {j.experience}</div></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700, color: '#2e7d32', fontSize: '0.9rem' }}>{j.salary}</div><small style={{ color: '#aaa' }}>{j.posted}</small></div>
              </div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.85rem', lineHeight: 1.5 }}>{j.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                <span style={st.badge}>{j.type}</span>
                {j.returnFriendly && <span style={{ ...st.badge, background: '#e8f5e9', color: '#2e7d32' }}>🔄 Return-Friendly</span>}
                <span style={{ ...st.badge, background: '#e3f2fd' }}>#{j.category}</span>
              </div>
            </div>
          ))}
          {jobs.length === 0 && <p style={st.empty}>No jobs match this filter.</p>}
        </div>
      )}

      {/* ── MENTORS TAB ── */}
      {tab === 'mentors' && (
        <div>
          <div style={{ ...st.card, background: '#fff3e0', textAlign: 'center' }}>
            <p style={{ color: '#e65100' }}>🧑‍🏫 Connect with experienced mentors who've walked the path. Your growth matters.</p>
          </div>
          {mentors.map((m) => (
            <div key={m.id} style={st.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h4 style={{ color: '#e65100', margin: '0 0 0.2rem' }}>{m.name}</h4><div style={{ fontSize: '0.85rem', color: '#888' }}>{m.title}</div><div style={{ fontSize: '0.85rem', color: '#666' }}>{m.speciality} · {m.experience}</div></div>
                <div style={{ color: '#f57f17', fontWeight: 600 }}>⭐ {m.rating}</div>
              </div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.85rem', lineHeight: 1.5, fontStyle: 'italic' }}>{m.bio}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                {m.languages.map((l) => <span key={l} style={st.badge}>{l}</span>)}
                {connectingId === m.id ? (
                  <div style={{ display: 'flex', gap: '0.3rem', marginLeft: 'auto', alignItems: 'center' }}>
                    <input placeholder="Message (optional)" value={connectMsg} onChange={(e) => setConnectMsg(e.target.value)} style={{ ...st.input, width: '150px', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }} />
                    <button onClick={() => handleConnect(m.id)} style={{ ...st.btn, padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Send</button>
                    <button onClick={() => setConnectingId(null)} style={{ ...st.btn, padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#888' }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => setConnectingId(m.id)} style={{ ...st.btn, padding: '0.3rem 0.75rem', fontSize: '0.8rem', marginLeft: 'auto' }}>Connect 🤝</button>
                )}
              </div>
            </div>
          ))}
          {connections.length > 0 && (
            <>
              <h4 style={{ color: '#e65100', margin: '1rem 0 0.5rem' }}>My Connections</h4>
              {connections.map((c) => (
                <div key={c._id} style={{ ...st.card, borderLeft: '4px solid #e65100' }}>
                  <strong>{c.mentorName}</strong> <span style={{ ...st.badge, background: c.status === 'pending' ? '#fff3e0' : '#e8f5e9', color: c.status === 'pending' ? '#e65100' : '#2e7d32' }}>{c.status}</span>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>{c.speciality}</div>
                  {c.message && <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.2rem' }}>💬 {c.message}</div>}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── COMMUNITY TAB ── */}
      {tab === 'community' && (
        <div>
          <div style={{ ...st.card, background: '#fff3e0', textAlign: 'center' }}>
            <p style={{ color: '#e65100' }}>🤝 Join programs, share experiences, and grow together. You're not alone on this journey.</p>
          </div>

          {/* Programs */}
          <h4 style={{ color: '#e65100', marginBottom: '0.5rem' }}>📌 Upcoming Programs</h4>
          {programs.map((p) => (
            <div key={p.id} style={st.card}>
              <h4 style={{ color: '#e65100', margin: '0 0 0.2rem' }}>{p.title}</h4>
              <div style={{ fontSize: '0.85rem', color: '#888' }}>{p.type} · {p.duration} · Starts: {p.startDate}</div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.85rem', lineHeight: 1.5 }}>{p.description}</p>
            </div>
          ))}

          {/* Create Post */}
          <details style={st.card}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#e65100' }}>+ Share with the community</summary>
            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              <input placeholder="Title" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} required style={st.input} />
              <textarea placeholder="Share your experience, question, or advice..." value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} required rows={3} style={{ ...st.input, resize: 'vertical' }} />
              <select value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value })} style={st.input}>
                <option value="career">Career</option><option value="upskilling">Upskilling</option><option value="motivation">Motivation</option><option value="question">Question</option>
              </select>
              <button type="submit" style={st.btn}>Share Post 🤝</button>
            </form>
          </details>

          {/* Posts */}
          <h4 style={{ color: '#e65100', margin: '1rem 0 0.5rem' }}>💬 Community Posts</h4>
          {posts.map((p) => (
            <div key={p._id} style={st.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><strong style={{ color: '#e65100' }}>{p.title}</strong><div style={{ fontSize: '0.8rem', color: '#aaa' }}>by {p.userName} · {new Date(p.createdAt).toLocaleDateString()}</div></div>
                <span style={st.badge}>#{p.category}</span>
              </div>
              <p style={{ color: '#555', margin: '0.4rem 0', lineHeight: 1.5, fontSize: '0.9rem' }}>{p.content}</p>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => handleLike(p._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>❤️ {p.likes}</button>
                <span style={{ color: '#aaa', fontSize: '0.8rem' }}>💬 {p.replies.length} replies</span>
              </div>
              {p.replies.length > 0 && (
                <div style={{ marginTop: '0.5rem', paddingLeft: '1rem', borderLeft: '2px solid #ffe0b2' }}>
                  {p.replies.slice(-3).map((r) => (
                    <div key={r._id} style={{ marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                      <strong style={{ color: '#e65100' }}>{r.userName}:</strong> <span style={{ color: '#555' }}>{r.content}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
                <input placeholder="Reply..." value={replyText[p._id] || ''} onChange={(e) => setReplyText({ ...replyText, [p._id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleReply(p._id)} style={{ ...st.input, flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.85rem' }} />
                <button onClick={() => handleReply(p._id)} style={{ ...st.btn, padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Reply</button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p style={st.empty}>No posts yet. Start the conversation! 🤝</p>}
        </div>
      )}
    </div>
  );
};

const st = {
  wrapper: { padding: '2rem 1rem', minHeight: 'calc(100vh - 60px)', background: '#fffde7', maxWidth: '700px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#e65100', fontSize: '1rem', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 600 },
  hero: { textAlign: 'center', background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', padding: '2rem', borderRadius: '16px', marginBottom: '1.5rem' },
  heroTitle: { color: '#e65100', margin: '0.25rem 0', fontSize: '1.5rem' },
  heroTag: { color: '#e65100', fontWeight: 600, fontSize: '1rem', margin: '0.25rem 0' },
  heroDesc: { color: '#666', lineHeight: 1.6, margin: '0.75rem 0 0', fontSize: '0.9rem' },
  tabs: { display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.5rem 0.7rem', border: '1px solid #ffcc80', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 },
  tabActive: { background: '#e65100', color: '#fff', borderColor: '#e65100' },
  card: { background: '#fff', padding: '1rem 1.25rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(230,81,0,0.06)', marginBottom: '0.75rem' },
  input: { padding: '0.6rem 0.75rem', border: '1px solid #ffcc80', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  btn: { padding: '0.6rem 1rem', background: '#e65100', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' },
  filterBtn: { padding: '0.35rem 0.65rem', border: '1px solid #ffcc80', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '0.8rem' },
  badge: { display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '12px', background: '#fff3e0', color: '#e65100', fontSize: '0.75rem', fontWeight: 500 },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  error: { background: '#ffebee', color: '#c62828', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  empty: { textAlign: 'center', color: '#aaa', padding: '2rem', fontStyle: 'italic' },
};

export default HerUdaan;
