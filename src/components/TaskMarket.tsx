import type { Task } from '../types';
import { X, MapPin, Award, Users } from 'lucide-react';

interface TaskMarketProps {
  tasks: Task[];
  onAcceptTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onClose: () => void;
}

export function TaskMarket({ tasks, onAcceptTask, onCompleteTask, onClose }: TaskMarketProps) {
  const openTasks = tasks.filter(t => t.status === 'open');
  const myTasks = tasks.filter(t => t.status !== 'open');

  return (
    <div className="task-panel">
      <div className="task-header">
        <div>
          <span className="task-title">Task Marketplace</span>
          <span className="task-subtitle">Real jobs • Real rewards</span>
        </div>
        <button onClick={onClose} className="close-btn">
          <X size={18} />
        </button>
      </div>

      <div className="task-content">
        {/* Open Tasks */}
        <div className="task-section">
          <div className="section-header">
            <Users size={16} /> Available Tasks ({openTasks.length})
          </div>
          
          {openTasks.length === 0 && (
            <div className="empty-state">No open tasks right now. Check back soon!</div>
          )}

          {openTasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-card-header">
                <div className="task-category">{task.category}</div>
                <div className="task-reward">
                  <Award size={14} /> {task.reward} coins
                </div>
              </div>
              
              <div className="task-main">
                <div className="task-name">{task.title}</div>
                <div className="task-desc">{task.description}</div>
              </div>

              <div className="task-footer">
                <div className="task-location">
                  <MapPin size={13} /> {task.location}
                </div>
                <div className="task-poster">by {task.posterName}</div>
              </div>

              <button 
                className="accept-btn"
                onClick={() => onAcceptTask(task.id)}
              >
                Accept Task
              </button>
            </div>
          ))}
        </div>

        {/* Accepted / Completed Tasks */}
        {myTasks.length > 0 && (
          <div className="task-section">
            <div className="section-header">
              Your Tasks ({myTasks.length})
            </div>

            {myTasks.map((task) => (
              <div key={task.id} className="task-card my-task">
                <div className="task-card-header">
                  <div className="task-category">{task.category}</div>
                  <div className={`task-status ${task.status}`}>
                    {task.status}
                  </div>
                </div>
                
                <div className="task-main">
                  <div className="task-name">{task.title}</div>
                </div>

                <div className="task-footer">
                  <div className="task-reward">
                    <Award size={14} /> {task.reward} coins
                  </div>
                </div>

                {task.status === 'accepted' && (
                  <button 
                    className="complete-btn"
                    onClick={() => onCompleteTask(task.id)}
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="task-footer-info">
        Complete tasks to earn Connect Coins &amp; boost your Trust Score
      </div>
    </div>
  );
}