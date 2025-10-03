import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [filters]);

  const getTaskProgress = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/tasks?${params}`);
      setTasks(response.data);
      
      // Calculate stats
      const allTasks = response.data;
      setStats({
        total: allTasks.length,
        completed: allTasks.filter(t => t.status === 'completed').length,
        pending: allTasks.filter(t => t.status === 'pending').length,
        inProgress: allTasks.filter(t => t.status === 'in-progress').length,
        highPriority: allTasks.filter(t => t.priority === 'high').length
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (tasks) => {
    setStats({
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      highPriority: tasks.filter(t => t.priority === 'high').length
    });
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post('/api/tasks', taskData);
      const newTasks = [response.data, ...tasks];
      setTasks(newTasks);
      updateStats(newTasks);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await axios.put(`/tasks/${taskId}`, taskData);
      const updatedTasks = tasks.map(task => 
        task._id === taskId ? response.data : task
      );
      setTasks(updatedTasks);
      updateStats(updatedTasks);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      const remainingTasks = tasks.filter(task => task._id !== taskId);
      setTasks(remainingTasks);
      updateStats(remainingTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-600 mt-2">Here's an overview of your tasks</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 w-full sm:w-auto"
          >
            Create Task +
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Tasks Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
            </div>
            <span className="text-2xl">📋</span>
          </div>
          <div className="mt-4">
            <div className="bg-gray-100 h-2 rounded-full">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${getTaskProgress()}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{getTaskProgress()}% completed</p>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-1">{stats.inProgress}</h3>
            </div>
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {stats.inProgress > 0 
              ? `${stats.inProgress} tasks currently active` 
              : 'No tasks in progress'}
          </p>
        </div>

        {/* Completed Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</h3>
            </div>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {stats.completed > 0 
              ? `Great job! ${stats.completed} tasks completed` 
              : 'No completed tasks yet'}
          </p>
        </div>

        {/* High Priority Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">High Priority</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{stats.highPriority}</h3>
            </div>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {stats.highPriority > 0 
              ? `${stats.highPriority} urgent tasks need attention` 
              : 'No high priority tasks'}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Tasks
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
          <p className="text-sm text-gray-500 mt-1">
            {tasks.length 
              ? `Showing ${tasks.length} task${tasks.length === 1 ? '' : 's'}` 
              : 'No tasks found'}
          </p>
        </div>
        <div className="p-6">
          <TaskList
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Task</h2>
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Task</h2>
              <TaskForm
                task={editingTask}
                onSubmit={(data) => handleUpdateTask(editingTask._id, data)}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;