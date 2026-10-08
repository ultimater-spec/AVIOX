import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Smartphone, CheckCircle } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: user?.username || '',
    mobile: user?.mobile || '',
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    maritalStatus: user?.maritalStatus || 'Single',
    place: user?.place || '',
    pincode: user?.pincode || '',
  });

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [otpForm, setOtpForm] = useState({ otp: '' });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.data.user);
      toast.success(res.data.message || 'Profile updated successfully.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      const res = await api.post('/auth/send-mobile-otp');
      setIsOtpSent(true);
      toast.success(res.data.message || 'OTP sent to your mobile.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await api.post('/auth/verify-mobile-otp', otpForm);
      updateUser(res.data.data.user);
      toast.success(res.data.message || 'Mobile verified successfully.');
      setIsOtpSent(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="container" style={{ padding: '3rem 2rem', maxWidth: '800px' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span className="section-label">User Profile</span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Personal Details
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginTop: '0.5rem' }}>Update your profile information and verify your email.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Mobile Verification Section */}
            <div className="card">
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smartphone size={18} /> Mobile Verification
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user?.mobile}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                    {user?.isMobileVerified ? 'Your mobile number is verified.' : 'Please verify your mobile number to book sessions.'}
                  </p>
                </div>
                {user?.isMobileVerified ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>
                    <CheckCircle size={16} /> Verified
                  </span>
                ) : (
                  <button onClick={handleSendOtp} className="btn-secondary" style={{ fontSize: '0.75rem' }}>
                    Send OTP
                  </button>
                )}
              </div>

              {isOtpSent && !user?.isMobileVerified && (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginTop: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label className="input-label">Enter OTP</label>
                    <input
                      type="text"
                      className="input"
                      value={otpForm.otp}
                      onChange={e => setOtpForm({ otp: e.target.value })}
                      placeholder="6-digit OTP"
                      required
                      maxLength={6}
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={isVerifying} style={{ height: '42px', fontSize: '0.75rem' }}>
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </button>
                </form>
              )}
            </div>

            {/* Profile Form */}
            <div className="card">
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} /> Profile Information
              </h3>

              <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Username</label>
                  <input type="text" className="input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
                </div>

                <div>
                  <label className="input-label">Mobile Number</label>
                  <input type="text" className="input" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required />
                </div>

                <div>
                  <label className="input-label">Date of Birth</label>
                  <input type="date" className="input" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                </div>

                <div>
                  <label className="input-label">Marital Status</label>
                  <select className="input" value={form.maritalStatus} onChange={e => setForm({ ...form, maritalStatus: e.target.value })}>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Place (City/Town)</label>
                  <input type="text" className="input" value={form.place} onChange={e => setForm({ ...form, place: e.target.value })} placeholder="e.g. Mumbai" />
                </div>

                <div>
                  <label className="input-label">Pincode</label>
                  <input type="text" className="input" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="e.g. 400001" maxLength={6} />
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Profile Details'}
                  </button>
                  <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
                    Back to Dashboard
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
