import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/todos/');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/todos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask, completed: false }),
      });
      if (response.ok) {
        const data = await response.json();
        setTasks([...tasks, data]);
        setNewTask('');
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, completed: !completed } : task
      );
      setTasks(updatedTasks);
      const response = await fetch(`http://localhost:8000/api/todos/${taskId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle task');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/todos/${taskId}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setEditTaskText(task.task);
  };

  const handleUpdateTask = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/todos/${editTaskId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: editTaskText }),
      });
      if (response.ok) {
        const updatedTasks = tasks.map(task =>
          task.id === editTaskId ? { ...task, task: editTaskText } : task
        );
        setTasks(updatedTasks);
        setEditTaskId(null);
        setEditTaskText('');
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className='App'>
      <Header title='Task Manager' />
      <div className='container'>
        <div className='d-flex flex-column'>
          <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task"
                className='input-field'
              />
           <button className='btn btn-success bg-gardient text-white fw-bold mb-2' onClick={handleAddTask}>Add Task</button>
        </div>
          <ul className='list-unstyled'>
            {tasks.map(task => (
              <li key={task.id}>
                {editTaskId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editTaskText}
                      onChange={(e) => setEditTaskText(e.target.value)}
                    />
                    <button className='btn btn-secondary ms-2' onClick={handleUpdateTask}>Update</button>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id, task.completed)}
                    />
                    <span className='fs-6 fw-bold' style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.task}</span>
                    <button className='btn btn-primary ms-2' onClick={() => handleEditTask(task)}>Edit</button>
                    <button className='btn btn-danger ms-2' onClick={() => handleDeleteTask(task.id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}

export default App;
