import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import Sidebar from '../components/Sidebar';
import { fetchApi } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const hasActiveFilters = search || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || sortOrder !== 'newest';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setSortOrder('newest');
    setPage(1);
  };

  const fetchTasks = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 8);
      
      if (search) queryParams.append('search', search);
      if (statusFilter !== 'ALL') queryParams.append('status', statusFilter);
      if (priorityFilter !== 'ALL') queryParams.append('priority', priorityFilter);
      queryParams.append('sort', sortOrder);
      
      const response = await fetchApi(`/tasks?${queryParams.toString()}`);
      if (response.success) {
        setTasks(response.data);
        setTotalPages(Math.ceil((response.total || 0) / 8) || 1);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [user, navigate, search, statusFilter, priorityFilter, sortOrder, page]);

  const handleSaveTask = async (taskData) => {
    const originalTasks = [...tasks];
    try {
      if (taskData.id) {
        setTasks(prev => prev.map(t => t._id === taskData.id ? { ...t, ...taskData } : t));
        setIsModalOpen(false);
        setEditingTask(null);
        
        await fetchApi(`/tasks/${taskData.id}`, {
          method: 'PUT',
          body: JSON.stringify(taskData)
        });
      } else {
        setIsModalOpen(false);
        setEditingTask(null);
        await fetchApi('/tasks', {
          method: 'POST',
          body: JSON.stringify(taskData)
        });
      }
      fetchTasks(true);
    } catch (err) {
      console.error('Failed to save task:', err);
      setTasks(originalTasks);
      alert(err.message || 'Failed to save task');
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(t => t._id !== taskId));
    
    try {
      await fetchApi(`/tasks/${taskId}`, { method: 'DELETE' });
      fetchTasks(true);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setTasks(originalTasks);
      alert(err.message || 'Failed to delete task');
    }
  };

  const handleToggleComplete = async (task) => {
    const originalTasks = [...tasks];
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    
    setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    
    try {
      await fetchApi(`/tasks/${task._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      fetchTasks(true);
    } catch (err) {
      console.error('Failed to update task:', err);
      setTasks(originalTasks);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <header className="dashboard-header-modern">
          <div className="header-greeting">
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
            <p>Heres what's happening with your projects today.</p>
          </div>
          <div className="header-profile">
            <div className="profile-avatar">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="dashboard-main-modern">
          <div className="controls-modern">
            <div className="search-filter-modern">
              <div className="search-box-modern">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              
              <div className="filter-box-modern">
                <Filter size={18} className="filter-icon" />
                <select 
                  value={statusFilter} 
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                >
                  <option value="ALL">All Status</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="filter-box-modern">
                <select 
                  value={priorityFilter} 
                  onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                >
                  <option value="ALL">All Priority</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div className="filter-box-modern">
                <select 
                  value={sortOrder} 
                  onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button className="btn-clear-filters" onClick={clearFilters}>
                  <X size={14} /> Clear
                </button>
              )}
            </div>
            
            <button 
              className="btn-primary-modern" 
              onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            >
              <Plus size={18} /> Add New Task
            </button>
          </div>

          {loading ? (
            <div className="loading-modern">
              <div className="spinner"></div>
              <p>Loading your tasks...</p>
            </div>
          ) : (
            <div className="task-content">
              <TaskList 
                tasks={tasks} 
                onEdit={(task) => { setEditingTask(task); setIsModalOpen(true); }}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
              />
              
              {totalPages > 1 && (
                <div className="pagination-modern">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-page-modern"><ChevronLeft size={16} /></button>
                  <span className="page-info">{page} / {totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-page-modern"><ChevronRight size={16} /></button>
                </div>
              )}
            </div>
          )}
        </main>

        {isModalOpen && (
          <TaskModal 
            task={editingTask} 
            onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
            onSave={handleSaveTask}
          />
        )}
      </div>
    </div>
  );
}
