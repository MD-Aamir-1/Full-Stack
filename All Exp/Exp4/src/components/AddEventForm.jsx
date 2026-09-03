import React, { useState } from 'react';

const AddEventForm = ({ onAddEvent, defaultDate }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') return;
    onAddEvent(title, defaultDate);
    setTitle('');
  };

  return (
    <form className="add-event-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add event title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">➕ Add Event</button>
    </form>
  );
};

export default AddEventForm;