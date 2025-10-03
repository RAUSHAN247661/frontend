import React from 'react';

const TaskList = ({ tasks, onEdit, onDelete, onUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await onUpdate(taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">Get started by creating your first task!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
              {task.user && (
                <p className="text-sm text-gray-500 mt-1">
                  Created by: {task.user.name}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 mb-4">{task.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {task.dueDate && (
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              )}
              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex space-x-2">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() => onEdit(task)}
                className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(task._id)}
                className="text-red-600 hover:text-red-800 px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;