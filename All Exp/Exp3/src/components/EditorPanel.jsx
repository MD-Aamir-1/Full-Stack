// src/components/EditorPanel.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

const EditorPanel = () => {
  const { user } = useAuth();
  const { addToast, ToastContainer } = useToast();

  const [posts, setPosts] = useState([
    { id: 1, title: 'Getting Started with React', status: 'published', author: 'Jane' },
    { id: 2, title: 'Understanding JWT', status: 'draft', author: 'John' },
    { id: 3, title: 'Role-Based Access Control', status: 'published', author: 'Alice' },
  ]);
  const [drafts, setDrafts] = useState([
    { id: 4, title: 'Advanced React Patterns', author: 'Bob' },
    { id: 5, title: 'State Management in 2026', author: 'Carol' },
  ]);
  const [comments] = useState([
    { id: 1, post: 'Getting Started with React', content: 'Great article!', author: 'User1' },
    { id: 2, post: 'Role-Based Access Control', content: 'Very useful.', author: 'User2' },
  ]);

  const [activeTab, setActiveTab] = useState('posts');

  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const handlePublishDraft = (id) => {
    const draft = drafts.find(d => d.id === id);
    if (draft) {
      setPosts([...posts, { ...draft, status: 'published' }]);
      setDrafts(drafts.filter(d => d.id !== id));
      addToast('Draft published', 'success');
    }
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

  return (
    <main>
      <ToastContainer />

      <div className="page-header">
        <h1>Editor Panel</h1>
      </div>

      <div className="tabs">
        <button className={activeTab === 'posts' ? 'tab active' : 'tab'} onClick={() => setActiveTab('posts')}>
          Posts
        </button>
        <button className={activeTab === 'drafts' ? 'tab active' : 'tab'} onClick={() => setActiveTab('drafts')}>
          Drafts
        </button>
        <button className={activeTab === 'comments' ? 'tab active' : 'tab'} onClick={() => setActiveTab('comments')}>
          Comments
        </button>
      </div>

      <div className="tab-content">
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
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
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

        {activeTab === 'drafts' && (
          <div className="card">
            {drafts.length === 0 ? <p>No drafts</p> : (
              <table className="admin-table">
                <thead><tr><th>Title</th><th>Author</th><th>Action</th></tr></thead>
                <tbody>
                  {drafts.map(d => (
                    <tr key={d.id}>
                      <td>{d.title}</td>
                      <td>{d.author}</td>
                      <td><button className="btn btn-primary btn-sm" onClick={() => handlePublishDraft(d.id)}>Publish</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="card">
            <table className="admin-table">
              <thead><tr><th>Post</th><th>Comment</th><th>Author</th></tr></thead>
              <tbody>
                {comments.map(c => (
                  <tr key={c.id}><td>{c.post}</td><td>{c.content}</td><td>{c.author}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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

export default EditorPanel;