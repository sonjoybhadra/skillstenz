'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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
  isActive: boolean;
  order: number;
}

const defaultPlan: Omit<Plan, '_id'> = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  currency: 'INR',
  duration: 1,
  durationType: 'month',
  features: [],
  aiQueryLimit: 10,
  isPopular: false,
  isActive: true,
  order: 0
};

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<Omit<Plan, '_id'>>(defaultPlan);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const router = useRouter();

  const fetchPlans = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/plans/admin/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      }
    } catch {
      console.error('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPlans();
  }, [router, fetchPlans]);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({ ...defaultPlan, order: plans.length });
    setShowModal(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      slug: plan.slug,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      duration: plan.duration,
      durationType: plan.durationType,
      features: [...plan.features],
      aiQueryLimit: plan.aiQueryLimit,
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      order: plan.order
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('accessToken');
      const url = editingPlan 
        ? `http://localhost:5000/api/plans/${editingPlan._id}`
        : 'http://localhost:5000/api/plans';
      
      const response = await fetch(url, {
        method: editingPlan ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        fetchPlans();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save plan');
      }
    } catch {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/plans/${planId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchPlans();
      } else {
        alert('Failed to delete plan');
      }
    } catch {
      alert('Network error');
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, { title: newFeature.trim(), included: true }]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const toggleFeatureIncluded = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index].included = !updatedFeatures[index].included;
    setFormData({ ...formData, features: updatedFeatures });
  };

  const formatPrice = (price: number, currency: string) => {
    const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    return `${symbols[currency] || currency}${price}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--bg-accent)' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Plans</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Configure subscription plans and pricing</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Plan
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan._id} className={`card relative ${!plan.isActive ? 'opacity-60' : ''}`}>
            {plan.isPopular && (
              <div className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg" style={{ background: 'var(--bg-accent)' }}>
                POPULAR
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.slug}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatPrice(plan.price, plan.currency)}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>
                    /{plan.duration} {plan.durationType}
                  </span>
                )}
              </div>

              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>

              <div className="mb-4">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  AI Queries: {plan.aiQueryLimit === -1 ? 'Unlimited' : plan.aiQueryLimit}/day
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Features:</p>
                <ul className="space-y-1">
                  {plan.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="text-xs flex items-center gap-1" style={{ color: f.included ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                      {f.included ? '✓' : '✗'} {f.title}
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-xs" style={{ color: 'var(--text-muted)' }}>+{plan.features.length - 4} more</li>
                  )}
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(plan)}
                  className="flex-1 py-2 px-3 rounded text-sm font-medium border hover:opacity-80"
                  style={{ borderColor: 'var(--bg-accent)', color: 'var(--bg-accent)' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="py-2 px-3 rounded text-sm font-medium border border-red-500 text-red-500 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {editingPlan ? 'Edit Plan' : 'Create Plan'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="input w-full"
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input w-full"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Price</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="input w-full"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="input w-full"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>AI Queries/Day</label>
                    <input
                      type="number"
                      value={formData.aiQueryLimit}
                      onChange={(e) => setFormData({ ...formData, aiQueryLimit: Number(e.target.value) })}
                      className="input w-full"
                      min="-1"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Duration</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="input w-full"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Duration Type</label>
                    <select
                      value={formData.durationType}
                      onChange={(e) => setFormData({ ...formData, durationType: e.target.value })}
                      className="input w-full"
                    >
                      <option value="day">Day</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                      <option value="lifetime">Lifetime</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Features</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="input flex-1"
                      placeholder="Add a feature..."
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button type="button" onClick={addFeature} className="btn btn-primary">Add</button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--bg-tertiary)' }}>
                        <button
                          type="button"
                          onClick={() => toggleFeatureIncluded(index)}
                          className={`w-6 h-6 rounded flex items-center justify-center text-white ${feature.included ? 'bg-green-500' : 'bg-gray-400'}`}
                        >
                          {feature.included ? '✓' : '✗'}
                        </button>
                        <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>{feature.title}</span>
                        <button type="button" onClick={() => removeFeature(index)} className="text-red-500 hover:text-red-700">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span style={{ color: 'var(--text-primary)' }}>Mark as Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span style={{ color: 'var(--text-primary)' }}>Active</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn">Cancel</button>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    {saving ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
