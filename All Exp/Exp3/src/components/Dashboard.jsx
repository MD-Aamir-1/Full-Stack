// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockFetchData } from '../api/mockAuth';
import { useToast } from '../hooks/useToast';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const { addToast, ToastContainer } = useToast();

  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    mockFetchData().then(setPosts);
  }, []);

  const handleDelete = (id) => {
    if (user?.role !== 'admin') {
      addToast('Only admins can delete', 'error');
      return;
    }
    setPosts(posts.filter(p => p.id !== id));
    addToast('Post deleted', 'success');
  };

  const handleEdit = (post) => {
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

  const handleCreate = () => {
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

  return (
    <main>
      <ToastContainer />

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <span className={`badge badge-${user?.role}`}>{user?.role}</span>
      </div>

      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card card">
            <div>
              <h3>{post.title}</h3>
              <p className="post-author">by {post.author}</p>
              <span className={`badge ${post.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                {post.status}
              </span>
            </div>
            <div className="post-actions">
              {(user?.role === 'admin' || user?.role === 'editor') && (
                <button className="btn btn-outline btn-sm" onClick={() => handleEdit(post)}>
                  Edit
                </button>
              )}
              {user?.role === 'admin' && (
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {(user?.role === 'admin' || user?.role === 'editor') && (
        <div className="create-bottom">
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + Create
          </button>
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
              <button className="btn btn-primary" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;