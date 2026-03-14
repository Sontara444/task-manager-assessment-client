import { LayoutDashboard, CheckSquare, Clock, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <CheckSquare size={24} />
        </div>
        <h2>TaskApp</h2>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-label">Main Menu</p>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/activity" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Clock size={20} />
            <span>Activity</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <p className="nav-label">Settings</p>
          <NavLink to="/preferences" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
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
  );
}
