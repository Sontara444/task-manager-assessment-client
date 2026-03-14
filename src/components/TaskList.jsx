import { Edit2, Trash2, Clock, CheckCircle, CircleDashed, CalendarClock, Check } from 'lucide-react';
import { decrypt } from '../utils/encryption';

export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks found</h3>
        <p>Try adjusting your search or filters, or create a new task.</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle size={18} className="text-success" />;
      case 'IN_PROGRESS': return <Clock size={18} className="text-primary" />;
      default: return <CircleDashed size={18} className="text-muted" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Completed';
      case 'IN_PROGRESS': return 'In Progress';
      default: return 'To Do';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#ef4444';
      case 'LOW': return '#22c55e';
      default: return '#f59e0b';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'COMPLETED') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="task-list-horizontal">
      {tasks.map(task => (
        <div key={task._id} className="task-row-card">
          <div className="task-row-main">
            <div className="task-row-header">
              <h3 className="task-title">{task.title}</h3>
              <div className={`task-badge badge-${task.status.toLowerCase()}`}>
                {getStatusIcon(task.status)}
                <span>{getStatusText(task.status)}</span>
              </div>
              {task.priority && (
                <span className="priority-badge" style={{ color: getPriorityColor(task.priority) }}>
                  {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                </span>
              )}
            </div>
            <p className="task-desc">{decrypt(task.description)}</p>
          </div>

          <div className="task-row-footer">
            <div className="task-dates">
              <span className="task-date">
                <Clock size={14} style={{ marginRight: '4px' }} />
                Created: {formatDate(task.createdAt)}
              </span>
              {task.dueDate && (
                <span className={`task-due-date ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}>
                  <CalendarClock size={14} style={{ marginRight: '4px' }} />
                  Due: {formatDate(task.dueDate)}
                </span>
              )}
            </div>
            <div className="task-actions">
              <button
                className={`btn-icon btn-complete ${task.status === 'COMPLETED' ? 'completed' : ''}`}
                title={task.status === 'COMPLETED' ? 'Mark as To Do' : 'Mark as Complete'}
                onClick={() => onToggleComplete(task)}
              >
                {task.status === 'COMPLETED' ? <CheckCircle size={16} /> : <Check size={16} />}
              </button>
              <button
                className="btn-icon btn-edit"
                title="Edit Task"
                onClick={() => onEdit(task)}
              >
                <Edit2 size={16} />
              </button>
              <button
                className="btn-icon btn-delete"
                title="Delete Task"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task._id);
                  }
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
