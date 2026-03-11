import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import herpaisaService from '../services/herpaisaService';

const TABS = ['savings', 'transactions', 'budgets', 'tips', 'pay'];

const HerPaisa = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('savings');

  // ── Savings Goals ──
  const [goals, setGoals] = useState([]);
  const [goalForm, setGoalForm] = useState({ name: '', targetAmount: '' });
  const [depositAmounts, setDepositAmounts] = useState({});

  // ── Transactions ──
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [txnForm, setTxnForm] = useState({ type: 'expense', category: '', amount: '', note: '' });

  // ── Budgets ──
  const [budgets, setBudgets] = useState([]);
  const [budgetForm, setBudgetForm] = useState({ category: '', limit: '' });

  // ── Tips ──
  const [tips, setTips] = useState([]);

  // ── UPI ──
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [paymentLinks, setPaymentLinks] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [copied, setCopied] = useState('');

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const flash = (message, isError = false) => {
    if (isError) { setErr(message); setMsg(''); }
    else { setMsg(message); setErr(''); }
    setTimeout(() => { setMsg(''); setErr(''); }, 3000);
  };

  const loadGoals = useCallback(async () => {
    try { const { data } = await herpaisaService.getGoals(); setGoals(data.goals); } catch {}
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      const [txnRes, sumRes] = await Promise.all([
        herpaisaService.getTransactions(),
        herpaisaService.getTransactionSummary(),
      ]);
      setTransactions(txnRes.data.transactions);
      setSummary(sumRes.data.summary);
    } catch {}
  }, []);

  const loadBudgets = useCallback(async () => {
    try { const { data } = await herpaisaService.getBudgets(); setBudgets(data.budgets); } catch {}
  }, []);

  const loadTips = useCallback(async () => {
    try { const { data } = await herpaisaService.getTips(); setTips(data.tips); } catch {}
  }, []);

  useEffect(() => {
    if (tab === 'savings') loadGoals();
    if (tab === 'transactions') loadTransactions();
    if (tab === 'budgets') loadBudgets();
    if (tab === 'tips') loadTips();
  }, [tab, loadGoals, loadTransactions, loadBudgets, loadTips]);

  // ── Handlers ──
  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await herpaisaService.createGoal({ ...goalForm, targetAmount: Number(goalForm.targetAmount) });
      setGoalForm({ name: '', targetAmount: '' });
      flash('Goal created!');
      loadGoals();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleDeposit = async (goalId) => {
    const amt = depositAmounts[goalId];
    if (!amt || amt <= 0) return;
    try {
      await herpaisaService.depositToGoal(goalId, { amount: Number(amt), method: 'manual' });
      setDepositAmounts({ ...depositAmounts, [goalId]: '' });
      flash('Deposit recorded!');
      loadGoals();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleDeleteGoal = async (id) => {
    try { await herpaisaService.deleteGoal(id); flash('Goal deleted.'); loadGoals(); }
    catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleCreateTxn = async (e) => {
    e.preventDefault();
    try {
      await herpaisaService.createTransaction({ ...txnForm, amount: Number(txnForm.amount) });
      setTxnForm({ type: 'expense', category: '', amount: '', note: '' });
      flash('Transaction recorded!');
      loadTransactions();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    try {
      await herpaisaService.createBudget({ ...budgetForm, limit: Number(budgetForm.limit) });
      setBudgetForm({ category: '', limit: '' });
      flash('Budget created!');
      loadBudgets();
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleGeneratePayLink = async (e) => {
    e.preventDefault();
    try {
      const { data } = await herpaisaService.generatePaymentLink({ amount: Number(payAmount), note: payNote });
      setPaymentLinks(data.payment);
      setPaymentVerified(false);
      setCopied('');
      flash('Payment link generated!');
    } catch (e) { flash(e.response?.data?.message || 'Failed', true); }
  };

  const handleCopyLink = (link, label) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    }).catch(() => flash('Failed to copy', true));
  };

  const handleVerifyPayment = async () => {
    if (!paymentLinks) return;
    setVerifying(true);
    try {
      const { data } = await herpaisaService.verifyPayment({
        txnRef: paymentLinks.txnRef,
        amount: paymentLinks.amount,
      });
      if (data.result?.verified) {
        setPaymentVerified(true);
        flash('Payment verified successfully!');
      } else {
        flash('Payment not yet received. Please try again.', true);
      }
    } catch (e) {
      flash(e.response?.data?.message || 'Verification failed', true);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={s.wrapper}>
      <button onClick={() => navigate('/dashboard')} style={s.back}>← Dashboard</button>
      <h2 style={s.title}>💰 HerPaisa — Finance</h2>

      {msg && <div style={s.success}>{msg}</div>}
      {err && <div style={s.error}>{err}</div>}

      {/* Tab bar */}
      <div className="tab-bar" style={s.tabs}>
        {TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); setPaymentLinks(null); setPaymentVerified(false); setCopied(''); }}
            style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
            {t === 'savings' ? '🐖 Savings' : t === 'transactions' ? '📊 Transactions' :
             t === 'budgets' ? '📋 Budgets' : t === 'tips' ? '💡 Tips' : '💳 UPI Pay'}
          </button>
        ))}
      </div>

      {/* ── SAVINGS TAB ── */}
      {tab === 'savings' && (
        <div>
          <form onSubmit={handleCreateGoal} style={s.form}>
            <input placeholder="Goal name (e.g. Emergency Fund)" value={goalForm.name}
              onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })} required style={s.input} />
            <input type="number" placeholder="Target ₹" value={goalForm.targetAmount}
              onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })} required min="1" style={s.input} />
            <button type="submit" style={s.btn}>+ Create Goal</button>
          </form>
          {goals.length === 0 && <p style={s.empty}>No savings goals yet. Create one above!</p>}
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
            return (
              <div key={g._id} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{g.name}</strong>
                  <button onClick={() => handleDeleteGoal(g._id)} style={s.delBtn}>✕</button>
                </div>
                <div style={s.progressBg}>
                  <div style={{ ...s.progressFill, width: `${pct}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666' }}>
                  <span>₹{g.savedAmount.toLocaleString()} / ₹{g.targetAmount.toLocaleString()}</span>
                  <span>{pct}%</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="number" placeholder="₹ Amount" value={depositAmounts[g._id] || ''}
                    onChange={(e) => setDepositAmounts({ ...depositAmounts, [g._id]: e.target.value })}
                    style={{ ...s.input, flex: 1 }} min="1" />
                  <button onClick={() => handleDeposit(g._id)} style={{ ...s.btn, padding: '0.5rem 1rem' }}>Deposit</button>
                </div>
                {g.deposits.length > 0 && (
                  <details style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                    <summary>{g.deposits.length} deposit(s)</summary>
                    {g.deposits.slice(-5).map((d) => (
                      <div key={d._id}>₹{d.amount} via {d.method} — {new Date(d.date).toLocaleDateString()}</div>
                    ))}
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── TRANSACTIONS TAB ── */}
      {tab === 'transactions' && (
        <div>
          {summary && (
            <div style={{ ...s.card, background: '#f0f4ff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div><div style={{ color: '#2e7d32', fontWeight: 700, fontSize: '1.2rem' }}>₹{summary.totalIncome.toLocaleString()}</div><small>Income</small></div>
                <div><div style={{ color: '#c62828', fontWeight: 700, fontSize: '1.2rem' }}>₹{summary.totalExpense.toLocaleString()}</div><small>Expense</small></div>
                <div><div style={{ color: '#1565c0', fontWeight: 700, fontSize: '1.2rem' }}>₹{summary.balance.toLocaleString()}</div><small>Balance</small></div>
              </div>
            </div>
          )}
          <form onSubmit={handleCreateTxn} style={s.form}>
            <select value={txnForm.type} onChange={(e) => setTxnForm({ ...txnForm, type: e.target.value })} style={s.input}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input placeholder="Category (food, rent, salary...)" value={txnForm.category}
              onChange={(e) => setTxnForm({ ...txnForm, category: e.target.value })} style={s.input} />
            <input type="number" placeholder="₹ Amount" value={txnForm.amount}
              onChange={(e) => setTxnForm({ ...txnForm, amount: e.target.value })} required min="0.01" step="0.01" style={s.input} />
            <input placeholder="Note (optional)" value={txnForm.note}
              onChange={(e) => setTxnForm({ ...txnForm, note: e.target.value })} style={s.input} />
            <button type="submit" style={s.btn}>+ Add Transaction</button>
          </form>
          {transactions.length === 0 && <p style={s.empty}>No transactions yet.</p>}
          {transactions.slice(0, 20).map((t) => (
            <div key={t._id} style={{ ...s.card, borderLeft: `4px solid ${t.type === 'income' ? '#4caf50' : '#ef5350'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ color: t.type === 'income' ? '#2e7d32' : '#c62828' }}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </strong>
                  <span style={{ marginLeft: '0.5rem', color: '#888', fontSize: '0.85rem' }}>{t.category}</span>
                </div>
                <small style={{ color: '#aaa' }}>{new Date(t.date).toLocaleDateString()}</small>
              </div>
              {t.note && <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>{t.note}</div>}
            </div>
          ))}
        </div>
      )}

      {/* ── BUDGETS TAB ── */}
      {tab === 'budgets' && (
        <div>
          <form onSubmit={handleCreateBudget} style={s.form}>
            <input placeholder="Category (food, transport...)" value={budgetForm.category}
              onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })} required style={s.input} />
            <input type="number" placeholder="Monthly limit ₹" value={budgetForm.limit}
              onChange={(e) => setBudgetForm({ ...budgetForm, limit: e.target.value })} required min="1" style={s.input} />
            <button type="submit" style={s.btn}>+ Set Budget</button>
          </form>
          {budgets.length === 0 && <p style={s.empty}>No budgets set. Create one above!</p>}
          {budgets.map((b) => {
            const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
            const over = b.spent > b.limit;
            return (
              <div key={b._id} style={{ ...s.card, borderLeft: `4px solid ${over ? '#c62828' : '#4caf50'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ textTransform: 'capitalize' }}>{b.category}</strong>
                  <small style={{ color: '#888' }}>{b.month}</small>
                </div>
                <div style={s.progressBg}>
                  <div style={{ ...s.progressFill, width: `${pct}%`, background: over ? '#c62828' : '#4caf50' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: over ? '#c62828' : '#666' }}>₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()}</span>
                  <span>{over ? '⚠️ Over budget!' : `${pct}%`}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TIPS TAB ── */}
      {tab === 'tips' && (
        <div>
          {tips.map((t) => (
            <div key={t.id} style={s.card}>
              <strong style={{ color: '#1565c0' }}>{t.title}</strong>
              <p style={{ margin: '0.5rem 0 0', color: '#555', lineHeight: 1.5 }}>{t.tip}</p>
              <small style={{ color: '#aaa' }}>#{t.category}</small>
            </div>
          ))}
        </div>
      )}

      {/* ── UPI PAY TAB ── */}
      {tab === 'pay' && (
        <div>
          <div style={{ ...s.card, background: '#f0f4ff', textAlign: 'center' }}>
            <p style={{ color: '#555', marginBottom: '0.5rem' }}>Pay via UPI — Works with Google Pay, BharatPe, PhonePe & more</p>
            <p style={{ color: '#888', fontSize: '0.8rem' }}>Generate a payment link below. On mobile, tap to open your UPI app. On desktop, copy the link or scan the QR-friendly URI.</p>
          </div>
          <form onSubmit={handleGeneratePayLink} style={s.form}>
            <input type="number" placeholder="₹ Amount" value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)} required min="1" style={s.input} />
            <input placeholder="Note (optional)" value={payNote}
              onChange={(e) => setPayNote(e.target.value)} style={s.input} />
            <button type="submit" style={s.btn}>Generate Payment Link</button>
          </form>
          {paymentLinks && (
            <div style={{ ...s.card, background: paymentVerified ? '#e8f5e9' : '#fff8e1' }}>
              <h4 style={{ color: paymentVerified ? '#2e7d32' : '#f57f17', marginBottom: '0.75rem' }}>
                {paymentVerified ? '✅ Payment Verified' : `💳 Payment Links Ready — ₹${paymentLinks.amount}`}
              </h4>

              {/* UPI URI copy section */}
              <div style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', wordBreak: 'break-all', fontSize: '0.8rem', color: '#555' }}>
                <strong>UPI Link:</strong> {paymentLinks.upiURI}
              </div>
              <button onClick={() => handleCopyLink(paymentLinks.upiURI, 'upi')}
                style={{ ...s.btn, background: copied === 'upi' ? '#4caf50' : '#ff9800', marginBottom: '1rem', width: '100%' }}>
                {copied === 'upi' ? '✓ Copied!' : '📋 Copy UPI Link'}
              </button>

              {/* App-specific deep links */}
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', fontWeight: 600 }}>Open in UPI App (mobile only):</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <a href={paymentLinks.googlePay} style={s.payBtn}>
                  <span>💚</span> Google Pay
                </a>
                <a href={paymentLinks.phonePe} style={{ ...s.payBtn, background: '#6a1b9a' }}>
                  <span>💜</span> PhonePe
                </a>
                <a href={paymentLinks.upiURI} style={{ ...s.payBtn, background: '#1565c0' }}>
                  <span>📱</span> Any UPI App
                </a>
              </div>

              {/* Web fallback link */}
              {paymentLinks.webLink && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', fontWeight: 600 }}>Web Payment (works on desktop):</p>
                  <a href={paymentLinks.webLink} target="_blank" rel="noopener noreferrer"
                    style={{ ...s.payBtn, background: '#00796b', textDecoration: 'none' }}>
                    <span>🌐</span> Pay via Web Link
                  </a>
                </div>
              )}

              {/* Copy individual links */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <button onClick={() => handleCopyLink(paymentLinks.googlePay, 'gpay')}
                  style={{ ...s.copyBtn, ...(copied === 'gpay' ? { background: '#4caf50', color: '#fff' } : {}) }}>
                  {copied === 'gpay' ? '✓ Copied' : 'Copy GPay Link'}
                </button>
                <button onClick={() => handleCopyLink(paymentLinks.phonePe, 'phonepe')}
                  style={{ ...s.copyBtn, ...(copied === 'phonepe' ? { background: '#4caf50', color: '#fff' } : {}) }}>
                  {copied === 'phonepe' ? '✓ Copied' : 'Copy PhonePe Link'}
                </button>
                {paymentLinks.webLink && (
                  <button onClick={() => handleCopyLink(paymentLinks.webLink, 'web')}
                    style={{ ...s.copyBtn, ...(copied === 'web' ? { background: '#4caf50', color: '#fff' } : {}) }}>
                    {copied === 'web' ? '✓ Copied' : 'Copy Web Link'}
                  </button>
                )}
              </div>

              {/* Verify payment */}
              {!paymentVerified && (
                <button onClick={handleVerifyPayment} disabled={verifying}
                  style={{ ...s.btn, background: verifying ? '#999' : '#2e7d32', width: '100%' }}>
                  {verifying ? '⏳ Verifying...' : '✔ I have paid — Verify Payment'}
                </button>
              )}

              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
                <div><strong>Ref:</strong> {paymentLinks.txnRef}</div>
                <div><strong>VPA:</strong> {paymentLinks.vpa}</div>
                <div><strong>Merchant:</strong> {paymentLinks.merchant}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const s = {
  wrapper: { padding: '2rem 1rem', minHeight: 'calc(100vh - 60px)', background: '#f5f9ff', maxWidth: '700px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#6c63ff', fontSize: '1rem', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 600 },
  title: { color: '#1565c0', marginBottom: '1rem' },
  tabs: { display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 },
  tabActive: { background: '#1565c0', color: '#fff', borderColor: '#1565c0' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' },
  input: { padding: '0.65rem 0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' },
  btn: { padding: '0.65rem', background: '#1565c0', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' },
  card: { background: '#fff', padding: '1rem 1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '0.75rem' },
  delBtn: { background: 'none', border: 'none', color: '#c62828', fontSize: '1.1rem', cursor: 'pointer' },
  progressBg: { background: '#e0e0e0', height: '8px', borderRadius: '4px', margin: '0.5rem 0', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#1565c0', borderRadius: '4px', transition: 'width 0.3s' },
  success: { background: '#e0ffe0', color: '#060', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  error: { background: '#ffe0e0', color: '#c00', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  empty: { textAlign: 'center', color: '#999', padding: '2rem' },
  payBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#2e7d32', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', justifyContent: 'center' },
  copyBtn: { padding: '0.4rem 0.75rem', border: '1px solid #ccc', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, color: '#555' },
};

export default HerPaisa;
