// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { mockFetchData } from '../api/mockAuth';

const AdminPanel = () => {
  const { user } = useAuth();
  const { addToast, ToastContainer } = useToast();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'editor' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'viewer' },
  ]);
  const [logs] = useState([
    { id: 1, action: 'User Alice logged in', timestamp: '2026-08-06 10:30' },
    { id: 2, action: 'Post "Hello" created by Bob', timestamp: '2026-08-06 10:15' },
    { id: 3, action: 'Admin deleted post #42', timestamp: '2026-08-06 09:45' },
  ]);
  const [settings, setSettings] = useState({
    siteName: 'MyApp',
    maintenanceMode: false,
    registrationOpen: true,
  });

  const [activeTab, setActiveTab] = useState('posts');

  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    mockFetchData().then(setPosts);
  }, []);

  const handleDeletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
    addToast('Post deleted', 'success');
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditAuthor(post.author);
  };

  const handleSaveEdit = () => {
    if (!editingPost) return;
    const updated = posts.map(p =>
      p.id === editingPost.id ? { ...p, title: editTitle, author: editAuthor } : p
    );
    setPosts(updated);
    setEditingPost(null);
    addToast('Post updated', 'success');
  };

  const handleCreatePost = () => {
    if (!newTitle.trim() || !newAuthor.trim()) {
      addToast('Fill all fields', 'error');
      return;
    }
    const newPost = {
      id: Date.now(),
      title: newTitle,
      author: newAuthor,
      status: 'draft',
    };
    setPosts([newPost, ...posts]);
    setShowCreate(false);
    setNewTitle('');
    setNewAuthor('');
    addToast('Post created', 'success');
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    addToast('User deleted', 'success');
  };

  const toggleMaintenance = () => {
    setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode });
    addToast(`Maintenance ${!settings.maintenanceMode ? 'enabled' : 'disabled'}`, 'info');
  };

  return (
    <main>
      <ToastContainer />
      <div className="page-header">
        <h1>Admin Panel</h1>
      </div>

      <div className="tabs">
        <button className={activeTab === 'posts' ? 'tab active' : 'tab'} onClick={() => setActiveTab('posts')}>Posts</button>
        <button className={activeTab === 'users' ? 'tab active' : 'tab'} onClick={() => setActiveTab('users')}>Users</button>
        <button className={activeTab === 'logs' ? 'tab active' : 'tab'} onClick={() => setActiveTab('logs')}>Logs</button>
        <button className={activeTab === 'settings' ? 'tab active' : 'tab'} onClick={() => setActiveTab('settings')}>Settings</button>
      </div>

      {activeTab === 'posts' && (
        <div className="card">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Status</th><th>Author</th><th>Action</th></tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td><span className={`badge ${p.status === 'published' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span></td>
                  <td>{p.author}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEditPost(p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeletePost(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="create-bottom">
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Create</button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={() => addToast('Add user (simulated)', 'info')}>+ Add User</button>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="card">
          <table className="admin-table">
            <thead><tr><th>Action</th><th>Timestamp</th></tr></thead>
            <tbody>
              {logs.map(log => <tr key={log.id}><td>{log.action}</td><td>{log.timestamp}</td></tr>)}
            </tbody>
          </table>
          <button className="btn btn-outline" onClick={() => addToast('Logs refreshed', 'info')}>Refresh</button>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card">
          <div className="setting-item">
            <label>Site Name</label>
            <input type="text" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} />
          </div>
          <div className="setting-item">
            <label>Maintenance</label>
            <button className={`btn ${settings.maintenanceMode ? 'btn-danger' : 'btn-primary'}`} onClick={toggleMaintenance}>
              {settings.maintenanceMode ? 'Disable' : 'Enable'}
            </button>
            <span>{settings.maintenanceMode ? '🔴 ON' : '🟢 OFF'}</span>
          </div>
          <div className="setting-item">
            <label>Registration</label>
            <input type="checkbox" checked={settings.registrationOpen} onChange={() => setSettings({...settings, registrationOpen: !settings.registrationOpen})} />
            <span>{settings.registrationOpen ? 'Open' : 'Closed'}</span>
          </div>
          <button className="btn btn-primary" onClick={() => addToast('Settings saved', 'success')}>Save</button>
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="modal-overlay" onClick={() => setEditingPost(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Post</h3>
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input type="text" value={editAuthor} onChange={e => setEditAuthor(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setEditingPost(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Create Post</h3>
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title" />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input type="text" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} placeholder="Author" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreatePost}>Create</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminPanel;