import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, CircleDashed, Flag, CalendarClock, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { fetchApi } from '../services/api';
import { decrypt } from '../utils/encryption';
import './Activity.css';

export default function Activity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = async () => {
      try {
        const res = await fetchApi('/tasks?limit=100');
        if (res.success) setTasks(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  const count = (key, val) => tasks.filter(t => t[key] === val).length;

  const recent = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getPriorityColor = (p) =>
    p === 'HIGH' ? '#ef4444' : p === 'LOW' ? '#22c55e' : '#f59e0b';

  return (
    <div className="dashboard-wrapper">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="dashboard-content">
        <header className="dashboard-header-modern">
          <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div>
            <h1 className="dashboard-title-modern">Activity</h1>
            <p className="dashboard-subtitle-modern">Overview of your task progress</p>
          </div>
          <div className="header-profile" onClick={() => navigate('/preferences')} style={{ cursor: 'pointer' }} title="User Preferences">
            <div className="profile-avatar">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="activity-main">
          {loading ? (
            <div className="loading-modern"><div className="spinner" /></div>
          ) : (
            <>
              <section className="activity-section">
                <h2 className="activity-section-title">By Status</h2>
                <div className="stat-cards">
                  <div className="stat-card">
                    <CircleDashed size={28} className="stat-icon muted" />
                    <div>
                      <p className="stat-label">To Do</p>
                      <p className="stat-number">{count('status', 'TODO')}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Clock size={28} className="stat-icon primary" />
                    <div>
                      <p className="stat-label">In Progress</p>
                      <p className="stat-number">{count('status', 'IN_PROGRESS')}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <CheckCircle size={28} className="stat-icon success" />
                    <div>
                      <p className="stat-label">Completed</p>
                      <p className="stat-number">{count('status', 'COMPLETED')}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="activity-section">
                <h2 className="activity-section-title">By Priority</h2>
                <div className="stat-cards">
                  {['HIGH', 'MEDIUM', 'LOW'].map(p => (
                    <div className="stat-card" key={p}>
                      <Flag size={28} style={{ color: getPriorityColor(p) }} />
                      <div>
                        <p className="stat-label">{p.charAt(0) + p.slice(1).toLowerCase()}</p>
                        <p className="stat-number">{count('priority', p)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="activity-section">
                <h2 className="activity-section-title">Recent Tasks</h2>
                {recent.length === 0 ? (
                  <p className="activity-empty">No tasks yet.</p>
                ) : (
                  <div className="recent-list">
                    {recent.map(task => (
                      <div key={task._id} className="recent-item">
                        <div className="recent-item-left">
                          <span className="recent-title">{task.title}</span>
                          <span className="recent-desc">{decrypt(task.description)}</span>
                        </div>
                        <div className="recent-item-right">
                          <span className={`task-badge badge-${task.status.toLowerCase()}`} style={{ fontSize: '0.72rem' }}>
                            {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status === 'COMPLETED' ? 'Completed' : 'To Do'}
                          </span>
                          <span className="recent-date">
                            <CalendarClock size={13} style={{ marginRight: '4px' }} />
                            {formatDate(task.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
