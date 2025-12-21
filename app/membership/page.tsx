'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

interface PlanFeature {
  title: string;
  included: boolean;
}

interface Plan {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  durationType: string;
  features: PlanFeature[];
  aiQueryLimit: number;
  isPopular: boolean;
  order: number;
}

interface Membership {
  planType: string;
  status: string;
  expiryDate: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

export default function MembershipPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentMembership, setCurrentMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const router = useRouter();

  const fetchPlans = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/plans`);
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      }
    } catch {
      console.error('Failed to fetch plans');
    }
  }, []);

  const fetchCurrentMembership = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/memberships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentMembership(data);
      }
    } catch {
      console.error('Failed to fetch membership');
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch {
      console.error('Failed to fetch user');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login?redirect=/membership');
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    Promise.all([fetchPlans(), fetchCurrentMembership(), fetchUser()]).finally(() => {
      setLoading(false);
    });

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [router, fetchPlans, fetchCurrentMembership, fetchUser]);

  const handleSubscribe = async (plan: Plan) => {
    if (plan.price === 0) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/memberships/upgrade`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ planType: plan.slug, duration: 0 }),
        });

        if (response.ok) {
          alert('Successfully switched to Free plan!');
          fetchCurrentMembership();
        }
      } catch {
        alert('Failed to switch plan');
      }
      return;
    }

    setProcessing(plan._id);

    try {
      const token = localStorage.getItem('accessToken');
      
      const orderResponse = await fetch(`${API_URL}/payments/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: plan._id }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.message || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SkillStenz',
        description: `${plan.name} Plan - ${plan.duration} ${plan.durationType}`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyResponse = await fetch(`${API_URL}/payments/razorpay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: orderData.paymentId
              }),
            });

            if (verifyResponse.ok) {
              alert('Payment successful! Your membership has been activated.');
              fetchCurrentMembership();
            } else {
              const error = await verifyResponse.json();
              alert(error.message || 'Payment verification failed');
            }
          } catch {
            alert('Payment verification failed');
          } finally {
            setProcessing(null);
          }
        },
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#2563eb' },
        modal: { ondismiss: () => setProcessing(null) }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Payment failed');
      setProcessing(null);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    return `${symbols[currency] || currency}${price}`;
  };

  const formatDuration = (duration: number, durationType: string) => {
    if (duration === 0 || durationType === 'lifetime') return 'forever';
    if (duration === 1) return durationType;
    return `${duration} ${durationType}s`;
  };

  const isCurrentPlan = (planSlug: string) => {
    return currentMembership?.planType === planSlug && currentMembership?.status === 'active';
  };

  const formatExpiryDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--bg-accent)' }}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Choose Your Plan</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Unlock your full potential with our premium plans. Get access to all courses, unlimited AI assistance, and more.
          </p>
        </div>

        {currentMembership && currentMembership.status === 'active' && (
          <div className="card mb-8 p-6 border-l-4" style={{ borderLeftColor: 'var(--bg-accent)' }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Current Plan</p>
                <h3 className="text-xl font-bold capitalize" style={{ color: 'var(--text-primary)' }}>{currentMembership.planType}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Expires</p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {currentMembership.expiryDate ? formatExpiryDate(currentMembership.expiryDate) : 'Never'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className={`card relative overflow-hidden transition-all hover:shadow-lg ${plan.isPopular ? 'ring-2 ring-blue-500' : ''} ${isCurrentPlan(plan.slug) ? 'ring-2 ring-green-500' : ''}`}>
              {plan.isPopular && (
                <div className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg" style={{ background: 'var(--bg-accent)' }}>POPULAR</div>
              )}
              {isCurrentPlan(plan.slug) && (
                <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">CURRENT</div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatPrice(plan.price, plan.currency)}</span>
                  {plan.price > 0 && <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>/{formatDuration(plan.duration, plan.durationType)}</span>}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={`text-sm ${feature.included ? '' : 'line-through opacity-50'}`} style={{ color: feature.included ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {feature.title}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processing === plan._id || isCurrentPlan(plan.slug)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${isCurrentPlan(plan.slug) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : plan.isPopular ? 'btn btn-primary' : 'border-2 hover:opacity-80'}`}
                  style={!isCurrentPlan(plan.slug) && !plan.isPopular ? { borderColor: 'var(--bg-accent)', color: 'var(--bg-accent)' } : {}}
                >
                  {processing === plan._id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : isCurrentPlan(plan.slug) ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="card inline-block p-6 max-w-2xl">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>🔒 Secure Payment</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              All payments are processed securely through Razorpay. We support UPI, Credit/Debit Cards, Net Banking, and Wallets.
            </p>
            <div className="flex justify-center gap-4 opacity-60">
              <span className="text-2xl">💳</span>
              <span className="text-2xl">📱</span>
              <span className="text-2xl">🏦</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>💯 30-day money-back guarantee • Cancel anytime</p>
        </div>
      </div>
    </Layout>
  );
}