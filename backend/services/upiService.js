/**
 * UPI Payment Service for HerPaisa.
 *
 * Generates UPI deep-link URLs that open Google Pay, BharatPe, PhonePe, etc.
 * Standard UPI URI: upi://pay?pa=<VPA>&pn=<Name>&am=<Amount>&cu=<Currency>&tn=<Note>
 *
 * For web, we also generate intent URLs for specific apps:
 *   - Google Pay:  https://pay.google.com/gp/v/save (or tez://upi/pay?...)
 *   - BharatPe:    upi://pay (generic — BharatPe handles UPI URIs)
 *   - PhonePe:     phonepe://pay?...
 *
 * In production, integrate with a payment gateway (Razorpay, Cashfree, etc.)
 * to verify payments via webhooks/callbacks.
 */

const { v4: uuidv4 } = require('uuid');

// Default merchant UPI VPA — set your own in .env
const MERCHANT_VPA = process.env.UPI_VPA || 'hershild@upi';
const MERCHANT_NAME = process.env.UPI_MERCHANT_NAME || 'HerShild';

/**
 * Generate a standard UPI payment link.
 */
const generateUPILink = ({ amount, note, currency = 'INR', txnRef = null }) => {
  const ref = txnRef || `HERSHILD-${uuidv4().slice(0, 8).toUpperCase()}`;
  const params = new URLSearchParams({
    pa: MERCHANT_VPA,
    pn: MERCHANT_NAME,
    am: String(Number(amount).toFixed(2)),
    cu: currency,
    tn: note || 'HerPaisa Savings Deposit',
    tr: ref,
  });

  const upiURI = `upi://pay?${params.toString()}`;

  return {
    txnRef: ref,
    upiURI,
    // App-specific deep links
    googlePay: `gpay://upi/pay?${params.toString()}`,
    bharatPe: upiURI, // BharatPe uses standard UPI URI
    phonePe: `phonepe://pay?${params.toString()}`,
    // Web fallback — generates a QR-friendly URL
    webLink: `https://upilinks.in/payment?${params.toString()}`,
    amount: Number(amount),
    currency,
    merchant: MERCHANT_NAME,
    vpa: MERCHANT_VPA,
  };
};

/**
 * Verify a UPI payment (MOCK).
 * In production, use Razorpay/Cashfree webhook to confirm payment status.
 */
const verifyPayment = async (txnRef) => {
  // Mock: always returns success in development
  console.log(`[HerPaisa] Verifying payment: ${txnRef}`);
  return {
    txnRef,
    status: 'SUCCESS',
    verified: true,
    message: 'Payment verified (mock)',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Financial literacy tips.
 */
const FINANCE_TIPS = [
  { id: 1, title: 'Start Small', tip: 'Save just ₹10 a day — that\'s ₹3,650 a year! Micro-savings add up quickly.', category: 'savings' },
  { id: 2, title: '50-30-20 Rule', tip: 'Allocate 50% of income to needs, 30% to wants, and 20% to savings & debt repayment.', category: 'budgeting' },
  { id: 3, title: 'Emergency Fund', tip: 'Build an emergency fund covering 3-6 months of expenses before investing.', category: 'savings' },
  { id: 4, title: 'Track Every Rupee', tip: 'Record all expenses daily. Awareness is the first step to financial control.', category: 'budgeting' },
  { id: 5, title: 'Avoid Impulse Buying', tip: 'Wait 24 hours before any non-essential purchase over ₹500.', category: 'spending' },
  { id: 6, title: 'UPI is Free', tip: 'UPI transactions have zero charges. Use Google Pay, PhonePe, or BharatPe for cashless payments.', category: 'digital' },
  { id: 7, title: 'Government Schemes', tip: 'Explore Sukanya Samriddhi, PM Jan Dhan Yojana, and Mahila Samman Savings Certificate.', category: 'schemes' },
  { id: 8, title: 'Compound Interest', tip: 'Start investing early — even ₹500/month at 12% grows to ₹5+ lakhs in 15 years.', category: 'investing' },
  { id: 9, title: 'Debt Snowball', tip: 'Pay off smallest debts first for quick wins, then tackle larger ones.', category: 'debt' },
  { id: 10, title: 'Insurance First', tip: 'Get health & term insurance before starting investments. Protection comes first.', category: 'insurance' },
];

const getFinanceTips = (category = null) => {
  if (category) return FINANCE_TIPS.filter((t) => t.category === category);
  return FINANCE_TIPS;
};

module.exports = { generateUPILink, verifyPayment, getFinanceTips };
