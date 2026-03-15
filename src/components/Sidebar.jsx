import { LayoutDashboard, CheckSquare, Clock, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <CheckSquare size={24} />
          </div>
          <h2>TaskApp</h2>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-label">Main Menu</p>
          <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/activity" onClick={onClose} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Clock size={20} />
            <span>Activity</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <p className="nav-label">Settings</p>
          <NavLink to="/preferences" onClick={onClose} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Settings size={20} />
            <span>Preferences</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item btn-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}
