import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import heradhikarService from '../services/heradhikarService';

const TABS = ['ageWise', 'schemes', 'eligibility', 'insurance', 'rights'];

const HerAdhikar = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('ageWise');

  const [ageGroups, setAgeGroups] = useState([]);
  const [selectedAge, setSelectedAge] = useState(null);
  const [ageSchemes, setAgeSchemes] = useState([]);

  const [allSchemes, setAllSchemes] = useState([]);
  const [schemeCat, setSchemeCat] = useState('all');
  const [schemeDetail, setSchemeDetail] = useState(null);

  const [eligForm, setEligForm] = useState({ age: '', income: '', caste: '', location: '' });
  const [eligResults, setEligResults] = useState(null);

  const [insurance, setInsurance] = useState([]);
  const [rights, setRights] = useState([]);
  const [rightsCat, setRightsCat] = useState('all');

  const loadAgeGroups = useCallback(async () => { try { const { data } = await heradhikarService.getAgeGroups(); setAgeGroups(data.ageGroups); } catch {} }, []);
  const loadSchemes = useCallback(async () => {
    try {
      const params = {};
      if (schemeCat !== 'all') params.category = schemeCat;
      const { data } = await heradhikarService.getSchemes(params);
      setAllSchemes(data.schemes);
    } catch {}
  }, [schemeCat]);
  const loadInsurance = useCallback(async () => { try { const { data } = await heradhikarService.getInsurance(); setInsurance(data.insurance); } catch {} }, []);
  const loadRights = useCallback(async () => {
    try {
      const cat = rightsCat === 'all' ? undefined : rightsCat;
      const { data } = await heradhikarService.getRights(cat);
      setRights(data.rights);
    } catch {}
  }, [rightsCat]);

  useEffect(() => {
    if (tab === 'ageWise') loadAgeGroups();
    if (tab === 'schemes') loadSchemes();
    if (tab === 'insurance') loadInsurance();
    if (tab === 'rights') loadRights();
  }, [tab, loadAgeGroups, loadSchemes, loadInsurance, loadRights]);
  useEffect(() => { if (tab === 'schemes') loadSchemes(); }, [schemeCat, loadSchemes, tab]);
  useEffect(() => { if (tab === 'rights') loadRights(); }, [rightsCat, loadRights, tab]);

  const handleSelectAge = async (ag) => {
    setSelectedAge(ag);
    try { const { data } = await heradhikarService.getSchemes({ ageGroup: ag.range.replace(/\s/g, '').replace('years', '').replace('–', '–') }); setAgeSchemes(data.schemes); } catch { setAgeSchemes([]); }
  };

  const handleEligibility = async (e) => {
    e.preventDefault();
    try {
      const { data } = await heradhikarService.checkEligibility({ age: Number(eligForm.age), income: eligForm.income ? Number(eligForm.income) : undefined, caste: eligForm.caste || undefined, location: eligForm.location || undefined });
      setEligResults(data);
    } catch { setEligResults(null); }
  };

  const handleViewScheme = async (id) => {
    try { const { data } = await heradhikarService.getSchemeDetail(id); setSchemeDetail(data.scheme); } catch {}
  };

  const SchemeCard = ({ s, showDetail = true }) => (
    <div style={{ ...st.card, borderLeft: s.important ? '4px solid #2e7d32' : '4px solid #c8e6c9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h4 style={{ color: '#2e7d32', margin: '0 0 0.2rem' }}>{s.name}</h4><div style={{ fontSize: '0.8rem', color: '#888' }}>{s.type} · {s.category}</div></div>
        {s.important && <span style={{ ...st.badge, background: '#e8f5e9', color: '#2e7d32' }}>⭐ Key Scheme</span>}
      </div>
      <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.85rem', lineHeight: 1.5 }}>{s.description}</p>
      <div style={{ fontSize: '0.85rem', color: '#666', margin: '0.3rem 0' }}>👤 <strong>For:</strong> {s.eligibility}</div>
      <div style={{ fontSize: '0.85rem', color: '#2e7d32', margin: '0.3rem 0' }}>🎁 <strong>Benefits:</strong> {s.benefits}</div>
      {showDetail && <button onClick={() => handleViewScheme(s.id)} style={{ ...st.btn, padding: '0.3rem 0.75rem', fontSize: '0.8rem', marginTop: '0.4rem' }}>View Full Details →</button>}
    </div>
  );

  return (
    <div style={st.wrapper}>
      <button onClick={() => navigate('/dashboard')} style={st.back}>← Dashboard</button>
      <div style={st.hero}>
        <div style={{ fontSize: '2.5rem' }}>⚖️</div>
        <h2 style={st.heroTitle}>HerAdhikar — Your Rights & Schemes</h2>
        <p style={st.heroTag}>Know your rights. Claim your benefits. At every stage of life.</p>
        <p style={st.heroDesc}>Discover government schemes, check eligibility, understand your rights, and access insurance — all in one place.</p>
      </div>

      <div className="tab-bar" style={st.tabs}>
        {TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); setSchemeDetail(null); setSelectedAge(null); setEligResults(null); }}
            style={{ ...st.tab, ...(tab === t ? st.tabActive : {}) }}>
            {t === 'ageWise' ? '🧒 Age-Wise' : t === 'schemes' ? '📜 Schemes' : t === 'eligibility' ? '✅ Eligibility' :
             t === 'insurance' ? '🛡️ Insurance' : '⚖️ Rights'}
          </button>
        ))}
      </div>

      {/* Scheme Detail Overlay */}
      {schemeDetail && (
        <div style={{ ...st.card, background: '#e8f5e9', border: '2px solid #4caf50' }}>
          <button onClick={() => setSchemeDetail(null)} style={{ float: 'right', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          <h3 style={{ color: '#2e7d32', margin: '0 0 0.5rem' }}>{schemeDetail.name}</h3>
          <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>{schemeDetail.type} · {schemeDetail.category}</div>
          <p style={{ color: '#555', lineHeight: 1.6 }}>{schemeDetail.description}</p>
          <div style={st.detailSection}><strong>👤 Eligibility:</strong> {schemeDetail.eligibility}</div>
          <div style={st.detailSection}><strong>🎁 Benefits:</strong> {schemeDetail.benefits}</div>
          <div style={st.detailSection}><strong>📄 Documents Needed:</strong><ul style={{ margin: '0.3rem 0 0 1.2rem', padding: 0 }}>{schemeDetail.documents.map((d, i) => <li key={i} style={{ fontSize: '0.85rem', color: '#555' }}>{d}</li>)}</ul></div>
          <div style={st.detailSection}><strong>📝 How to Apply:</strong> {schemeDetail.howToApply}</div>
          {schemeDetail.portal && <div style={st.detailSection}><strong>🌐 Portal:</strong> <a href={schemeDetail.portal} target="_blank" rel="noreferrer" style={{ color: '#1565c0' }}>{schemeDetail.portal}</a></div>}
        </div>
      )}

      {/* ── AGE-WISE TAB ── */}
      {tab === 'ageWise' && !selectedAge && (
        <div>
          <div style={{ ...st.card, background: '#e8f5e9', textAlign: 'center' }}>
            <p style={{ color: '#2e7d32' }}>🧒👩🧓 Select your age group to see schemes designed for your life stage.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {ageGroups.map((ag) => (
              <div key={ag.id} onClick={() => handleSelectAge(ag)} style={{ ...st.card, cursor: 'pointer', textAlign: 'center', transition: 'transform 0.15s' }}>
                <div style={{ fontSize: '2rem' }}>{ag.icon}</div>
                <div style={{ fontWeight: 700, color: '#2e7d32', fontSize: '1rem' }}>{ag.range}</div>
                <div style={{ fontWeight: 500, color: '#333', fontSize: '0.9rem' }}>{ag.label}</div>
                <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.3rem' }}>{ag.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'ageWise' && selectedAge && (
        <div>
          <button onClick={() => setSelectedAge(null)} style={{ ...st.back, marginBottom: '0.5rem' }}>← Back to Age Groups</button>
          <div style={{ ...st.card, background: '#e8f5e9' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>{selectedAge.icon}</div>
            <h3 style={{ color: '#2e7d32', margin: 0 }}>{selectedAge.range} — {selectedAge.label}</h3>
            <p style={{ color: '#666', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>{selectedAge.description}</p>
          </div>
          {ageSchemes.length === 0 && <p style={st.empty}>No schemes found for this age group.</p>}
          {ageSchemes.map((s) => <SchemeCard key={s.id} s={s} />)}
        </div>
      )}

      {/* ── SCHEMES TAB ── */}
      {tab === 'schemes' && (
        <div>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['all', 'health', 'education', 'maternity', 'nutrition', 'skills', 'finance', 'entrepreneurship', 'housing', 'pension'].map((c) => (
              <button key={c} onClick={() => setSchemeCat(c)} style={{ ...st.filterBtn, ...(schemeCat === c ? { background: '#2e7d32', color: '#fff' } : {}) }}>
                {c === 'all' ? '🌟 All' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          {allSchemes.map((s) => <SchemeCard key={s.id} s={s} />)}
        </div>
      )}

      {/* ── ELIGIBILITY TAB ── */}
      {tab === 'eligibility' && (
        <div>
          <div style={{ ...st.card, background: '#e8f5e9', textAlign: 'center' }}>
            <p style={{ color: '#2e7d32' }}>✅ Answer a few simple questions to find schemes you're eligible for.</p>
          </div>
          <div style={st.card}>
            <form onSubmit={handleEligibility} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><label style={st.label}>Age *</label><input type="number" placeholder="Your age" value={eligForm.age} onChange={(e) => setEligForm({ ...eligForm, age: e.target.value })} required min="0" max="120" style={st.input} /></div>
              <div><label style={st.label}>Annual Family Income (₹)</label><input type="number" placeholder="e.g. 100000 (optional)" value={eligForm.income} onChange={(e) => setEligForm({ ...eligForm, income: e.target.value })} style={st.input} /></div>
              <div><label style={st.label}>Category</label>
                <select value={eligForm.caste} onChange={(e) => setEligForm({ ...eligForm, caste: e.target.value })} style={st.input}>
                  <option value="">-- Select (optional) --</option><option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option>
                </select></div>
              <div><label style={st.label}>State</label><input placeholder="e.g. Delhi (optional)" value={eligForm.location} onChange={(e) => setEligForm({ ...eligForm, location: e.target.value })} style={st.input} /></div>
              <button type="submit" style={st.btn}>Check Eligibility ✅</button>
            </form>
          </div>

          {eligResults && (
            <div>
              <div style={{ ...st.card, background: '#e8f5e9' }}>
                <strong style={{ color: '#2e7d32' }}>{eligResults.message}</strong>
              </div>
              {eligResults.results.map((r) => (
                <div key={r.scheme.id} style={{ ...st.card, borderLeft: `4px solid ${r.matchLevel === 'eligible' ? '#4caf50' : '#ff9800'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ color: '#2e7d32', margin: 0 }}>{r.scheme.name}</h4>
                    <span style={{ ...st.badge, background: r.matchLevel === 'eligible' ? '#e8f5e9' : '#fff3e0', color: r.matchLevel === 'eligible' ? '#2e7d32' : '#e65100' }}>
                      {r.matchLevel === 'eligible' ? '✅ Eligible' : '🟡 Possibly Eligible'}
                    </span>
                  </div>
                  <p style={{ color: '#555', fontSize: '0.85rem', margin: '0.3rem 0' }}>{r.scheme.description}</p>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{r.reason}</div>
                  <button onClick={() => handleViewScheme(r.scheme.id)} style={{ ...st.btn, padding: '0.25rem 0.6rem', fontSize: '0.75rem', marginTop: '0.3rem' }}>View Details →</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── INSURANCE TAB ── */}
      {tab === 'insurance' && (
        <div>
          <div style={{ ...st.card, background: '#e8f5e9', textAlign: 'center' }}>
            <p style={{ color: '#2e7d32' }}>🛡️ Affordable government insurance for health, life, accidents, and maternity.</p>
          </div>
          {insurance.map((ins) => (
            <div key={ins.id} style={st.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h4 style={{ color: '#2e7d32', margin: '0 0 0.2rem' }}>{ins.name}</h4><div style={{ fontSize: '0.8rem', color: '#888' }}>{ins.type}</div></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700, color: '#2e7d32', fontSize: '1rem' }}>{ins.premium}</div><small style={{ color: '#888' }}>per year</small></div>
              </div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.85rem', lineHeight: 1.5 }}>{ins.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.85rem', color: '#666', margin: '0.3rem 0' }}>
                <div>🎁 <strong>Coverage:</strong> {ins.coverage}</div>
                <div>👤 <strong>For:</strong> {ins.eligibility}</div>
                <div>📝 <strong>Enroll:</strong> {ins.enrollment}</div>
                <div>🔄 <strong>Renewal:</strong> {ins.renewal}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── RIGHTS TAB ── */}
      {tab === 'rights' && (
        <div>
          <div style={{ ...st.card, background: '#e8f5e9', textAlign: 'center' }}>
            <p style={{ color: '#2e7d32' }}>⚖️ Every woman has rights protected by law. Know them. Claim them.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['all', 'employment', 'safety', 'maternity', 'property', 'legal', 'education', 'health'].map((c) => (
              <button key={c} onClick={() => setRightsCat(c)} style={{ ...st.filterBtn, ...(rightsCat === c ? { background: '#2e7d32', color: '#fff' } : {}) }}>
                {c === 'all' ? '🌟 All' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          {rights.map((r) => (
            <div key={r.id} style={{ ...st.card, borderLeft: '4px solid #2e7d32' }}>
              <h4 style={{ color: '#2e7d32', margin: '0 0 0.2rem' }}>{r.title}</h4>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.3rem' }}>📜 {r.law}</div>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>{r.description}</p>
              <span style={{ ...st.badge, background: '#e8f5e9' }}>#{r.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const st = {
  wrapper: { padding: '2rem 1rem', minHeight: 'calc(100vh - 60px)', background: '#f1f8e9', maxWidth: '700px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#2e7d32', fontSize: '1rem', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 600 },
  hero: { textAlign: 'center', background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', padding: '2rem', borderRadius: '16px', marginBottom: '1.5rem' },
  heroTitle: { color: '#2e7d32', margin: '0.25rem 0', fontSize: '1.5rem' },
  heroTag: { color: '#2e7d32', fontWeight: 600, fontSize: '1rem', margin: '0.25rem 0' },
  heroDesc: { color: '#666', lineHeight: 1.6, margin: '0.75rem 0 0', fontSize: '0.9rem' },
  tabs: { display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.5rem 0.7rem', border: '1px solid #a5d6a7', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 },
  tabActive: { background: '#2e7d32', color: '#fff', borderColor: '#2e7d32' },
  card: { background: '#fff', padding: '1rem 1.25rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(46,125,50,0.06)', marginBottom: '0.75rem' },
  input: { padding: '0.6rem 0.75rem', border: '1px solid #a5d6a7', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  label: { display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem', fontWeight: 500 },
  btn: { padding: '0.6rem 1rem', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' },
  filterBtn: { padding: '0.35rem 0.65rem', border: '1px solid #a5d6a7', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '0.78rem' },
  badge: { display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '12px', background: '#f1f8e9', color: '#2e7d32', fontSize: '0.75rem', fontWeight: 500 },
  detailSection: { margin: '0.5rem 0', fontSize: '0.9rem', color: '#555', lineHeight: 1.5 },
  empty: { textAlign: 'center', color: '#aaa', padding: '2rem', fontStyle: 'italic' },
};

export default HerAdhikar;
