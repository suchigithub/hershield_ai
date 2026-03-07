import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import hershikshaService from '../services/hershikshaService';

const TABS = ['scholarships', 'courses', 'skills', 'certifications', 'family'];

const HerShiksha = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('scholarships');

  const [scholarships, setScholarships] = useState([]);
  const [schType, setSchType] = useState('all');

  const [courses, setCourses] = useState([]);
  const [courseCat, setCourseCat] = useState('all');

  const [skillPrograms, setSkillPrograms] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [familyIdeas, setFamilyIdeas] = useState([]);

  const loadScholarships = useCallback(async () => {
    try { const t = schType === 'all' ? undefined : schType; const { data } = await hershikshaService.getScholarships(t); setScholarships(data.scholarships); } catch {}
  }, [schType]);
  const loadCourses = useCallback(async () => {
    try { const c = courseCat === 'all' ? undefined : courseCat; const { data } = await hershikshaService.getCourses(c); setCourses(data.courses); } catch {}
  }, [courseCat]);
  const loadSkills = useCallback(async () => { try { const { data } = await hershikshaService.getSkillPrograms(); setSkillPrograms(data.programs); } catch {} }, []);
  const loadCerts = useCallback(async () => { try { const { data } = await hershikshaService.getCertifications(); setCertifications(data.certifications); } catch {} }, []);
  const loadFamily = useCallback(async () => { try { const { data } = await hershikshaService.getFamilyLearning(); setFamilyIdeas(data.ideas); } catch {} }, []);

  useEffect(() => {
    if (tab === 'scholarships') loadScholarships();
    if (tab === 'courses') loadCourses();
    if (tab === 'skills') loadSkills();
    if (tab === 'certifications') loadCerts();
    if (tab === 'family') loadFamily();
  }, [tab, loadScholarships, loadCourses, loadSkills, loadCerts, loadFamily]);
  useEffect(() => { if (tab === 'scholarships') loadScholarships(); }, [schType, loadScholarships, tab]);
  useEffect(() => { if (tab === 'courses') loadCourses(); }, [courseCat, loadCourses, tab]);

  return (
    <div style={s.wrapper}>
      <button onClick={() => navigate('/dashboard')} style={s.back}>← Dashboard</button>
      <div style={s.hero}>
        <div style={{ fontSize: '2.5rem' }}>🎓</div>
        <h2 style={s.heroTitle}>HerShiksha — Education</h2>
        <p style={s.heroTag}>Learn, grow, and shine — together.</p>
        <p style={s.heroDesc}>Access scholarships, world-class courses, skill programs, and certifications. Education succeeds best when supported at home — learn as a family!</p>
      </div>

      <div className="tab-bar" style={s.tabs}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
            {t === 'scholarships' ? '🎓 Scholarships' : t === 'courses' ? '💻 Courses' : t === 'skills' ? '🛠️ Skills' :
             t === 'certifications' ? '📜 Certifications' : '💑 Family Learning'}
          </button>
        ))}
      </div>

      {/* ── SCHOLARSHIPS TAB ── */}
      {tab === 'scholarships' && (
        <div>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
            {['all', 'National', 'International'].map((t) => (
              <button key={t} onClick={() => setSchType(t)} style={{ ...s.filterBtn, ...(schType === t ? { background: '#00838f', color: '#fff' } : {}) }}>
                {t === 'all' ? '🌟 All' : t === 'National' ? '🇮🇳 National' : '🌍 International'}
              </button>
            ))}
          </div>
          {scholarships.map((sch) => (
            <div key={sch.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h4 style={{ color: '#00838f', margin: '0 0 0.2rem' }}>{sch.name}</h4><div style={{ fontSize: '0.8rem', color: '#888' }}>{sch.provider} · {sch.type}</div></div>
                <span style={{ ...s.badge, background: sch.type === 'International' ? '#e3f2fd' : '#e0f7fa' }}>{sch.type === 'International' ? '🌍' : '🇮🇳'} {sch.category}</span>
              </div>
              <div style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#555' }}>
                <div>👤 <strong>Eligibility:</strong> {sch.eligibility}</div>
                <div style={{ color: '#00838f' }}>🎁 <strong>Benefits:</strong> {sch.benefits}</div>
                <div>📅 <strong>Deadline:</strong> {sch.deadline}</div>
                <div>📝 <strong>How to apply:</strong> {sch.howToApply}</div>
              </div>
              {sch.portal && <a href={sch.portal} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#1565c0' }}>🌐 Visit Portal →</a>}
            </div>
          ))}
        </div>
      )}

      {/* ── COURSES TAB ── */}
      {tab === 'courses' && (
        <div>
          <div style={{ ...s.card, background: '#e0f7fa', textAlign: 'center' }}>
            <p style={{ color: '#00838f' }}>💻 Trusted courses from Khan Academy, Coursera, edX & more. Many are FREE!</p>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['all', 'tech', 'finance', 'business', 'design', 'language', 'wellness', 'digital', 'academics'].map((c) => (
              <button key={c} onClick={() => setCourseCat(c)} style={{ ...s.filterBtn, ...(courseCat === c ? { background: '#00838f', color: '#fff' } : {}) }}>
                {c === 'all' ? '🌟 All' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          {courses.map((c) => (
            <div key={c.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h4 style={{ color: '#00838f', margin: '0 0 0.2rem' }}>{c.title}</h4><div style={{ fontSize: '0.8rem', color: '#888' }}>{c.platform} · {c.duration} · {c.level}</div></div>
                <div>{c.free ? <span style={{ ...s.badge, background: '#e8f5e9', color: '#2e7d32' }}>FREE</span> : <span style={s.badge}>Paid</span>}</div>
              </div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.85rem', lineHeight: 1.5 }}>{c.description}</p>
              {c.familyTip && (
                <div style={{ background: '#fff3e0', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#e65100', margin: '0.4rem 0' }}>
                  {c.familyTip}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {c.certificate && <span style={{ ...s.badge, background: '#e3f2fd', color: '#1565c0' }}>🎓 Certificate</span>}
                <span style={s.badge}>#{c.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SKILL PROGRAMS TAB ── */}
      {tab === 'skills' && (
        <div>
          <div style={{ ...s.card, background: '#e0f7fa', textAlign: 'center' }}>
            <p style={{ color: '#00838f' }}>🛠️ Government-backed skill development programs — most are completely FREE with certificates!</p>
          </div>
          {skillPrograms.map((p) => (
            <div key={p.id} style={{ ...s.card, borderLeft: '4px solid #00838f' }}>
              <h4 style={{ color: '#00838f', margin: '0 0 0.2rem' }}>{p.title}</h4>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{p.provider} · {p.duration}</div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.85rem', lineHeight: 1.5 }}>{p.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                <span style={{ ...s.badge, background: p.cost === 'FREE' ? '#e8f5e9' : '#fff3e0', color: p.cost === 'FREE' ? '#2e7d32' : '#e65100' }}>{p.cost}</span>
                {p.certificate && <span style={{ ...s.badge, background: '#e3f2fd', color: '#1565c0' }}>🎓 Certificate</span>}
                <span style={s.badge}>{p.category}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.3rem' }}>👥 For: {p.targetAudience}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── CERTIFICATIONS TAB ── */}
      {tab === 'certifications' && (
        <div>
          <div style={{ ...s.card, background: '#e0f7fa', textAlign: 'center' }}>
            <p style={{ color: '#00838f' }}>📜 Industry-recognized certifications that boost your resume and open doors to new careers.</p>
          </div>
          {certifications.map((cert) => (
            <div key={cert.id} style={s.card}>
              <h4 style={{ color: '#00838f', margin: '0 0 0.2rem' }}>{cert.name}</h4>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{cert.provider} · {cert.duration} · {cert.cost}</div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.85rem', lineHeight: 1.5 }}>{cert.value}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.4rem' }}>
                {cert.fields.map((f) => <span key={f} style={s.badge}>{f}</span>)}
              </div>
              {cert.familyTip && (
                <div style={{ background: '#fff3e0', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#e65100' }}>
                  {cert.familyTip}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── FAMILY LEARNING TAB ── */}
      {tab === 'family' && (
        <div>
          <div style={{ ...s.card, background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>💑👨‍👩‍👧</div>
            <h3 style={{ color: '#00838f', margin: '0.5rem 0 0.3rem' }}>Education Succeeds When Supported at Home</h3>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>
              When partners learn together, families grow stronger. Here are practical ways to make education a shared, joyful experience.
            </p>
          </div>
          {familyIdeas.map((idea) => (
            <div key={idea.id} style={{ ...s.card, borderLeft: '4px solid #00838f' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2rem', minWidth: '2rem' }}>{idea.icon}</div>
                <div>
                  <h4 style={{ color: '#00838f', margin: '0 0 0.3rem' }}>{idea.title}</h4>
                  <p style={{ color: '#555', margin: '0 0 0.4rem', fontSize: '0.9rem', lineHeight: 1.6 }}>{idea.description}</p>
                  <div style={{ background: '#f1f8e9', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#33691e' }}>
                    💡 <strong>How to start:</strong> {idea.howTo}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ ...s.card, background: '#fff3e0', textAlign: 'center' }}>
            <p style={{ color: '#e65100', fontWeight: 600, fontSize: '1rem' }}>
              "When a woman learns, a family learns. When a family learns, a nation grows." 🌟
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  wrapper: { padding: '2rem 1rem', minHeight: 'calc(100vh - 60px)', background: '#e0f7fa', maxWidth: '700px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#00838f', fontSize: '1rem', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 600 },
  hero: { textAlign: 'center', background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)', padding: '2rem', borderRadius: '16px', marginBottom: '1.5rem' },
  heroTitle: { color: '#00838f', margin: '0.25rem 0', fontSize: '1.5rem' },
  heroTag: { color: '#00838f', fontWeight: 600, fontSize: '1rem', margin: '0.25rem 0' },
  heroDesc: { color: '#555', lineHeight: 1.6, margin: '0.75rem 0 0', fontSize: '0.9rem' },
  tabs: { display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.5rem 0.7rem', border: '1px solid #80cbc4', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 },
  tabActive: { background: '#00838f', color: '#fff', borderColor: '#00838f' },
  card: { background: '#fff', padding: '1rem 1.25rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,131,143,0.06)', marginBottom: '0.75rem' },
  filterBtn: { padding: '0.35rem 0.65rem', border: '1px solid #80cbc4', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '0.78rem' },
  badge: { display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '12px', background: '#e0f7fa', color: '#00838f', fontSize: '0.75rem', fontWeight: 500 },
};

export default HerShiksha;
