import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Save, AlertCircle, CheckCircle2, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { fetchApi } from '../services/api';
import './Preferences.css';

export default function Preferences() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setName(user.name || '');
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetchApi('/auth/updatedetails', {
        method: 'PUT',
        body: JSON.stringify({ name })
      });

      if (res.success) {
        setUser(res.data);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetchApi('/auth/updatepassword', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage({ type: 'success', text: 'Password updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="dashboard-content">
        <header className="dashboard-header-modern">
          <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div>
            <h1 className="dashboard-title-modern">Preferences</h1>
            <p className="dashboard-subtitle-modern">Manage your account settings and security</p>
          </div>
          <div className="header-profile" onClick={() => navigate('/preferences')} style={{ cursor: 'pointer' }} title="User Preferences">
            <div className="profile-avatar">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="preferences-main">
          {message.text && (
            <div className={`status-alert ${message.type}`}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          <div className="preferences-grid">
            <section className="preference-section">
              <div className="section-header">
                <User size={20} className="section-icon" />
                <h3>Profile Information</h3>
              </div>
              <form onSubmit={handleUpdateProfile} className="preference-form">
                <div className="form-group">
                  <label htmlFor="name">Display Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="disabled-input"
                  />
                  <p className="input-hint">Email cannot be changed.</p>
                </div>
                <button type="submit" className="btn-primary-modern" disabled={isLoading || name === user?.name}>
                  <Save size={18} />
                  <span>{isLoading ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </form>
            </section>

            <section className="preference-section">
              <div className="section-header">
                <Lock size={20} className="section-icon" />
                <h3>Security</h3>
              </div>
              <form onSubmit={handleUpdatePassword} className="preference-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary-modern" disabled={isLoading}>
                  <Save size={18} />
                  <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
