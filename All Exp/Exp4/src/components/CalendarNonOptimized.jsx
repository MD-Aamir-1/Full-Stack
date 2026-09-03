import React, { useState } from 'react';
import DayColumnNonOptimized from './DayColumnNonOptimized';
import { useCalendar } from '../hooks/useCalendar';

const CalendarNonOptimized = () => {
  const { selectedDate, setSelectedDate, events, updateEventDate, addEvent, deleteEvent } = useCalendar();
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(selectedDate);
  const [renderCount, setRenderCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('calendar');

  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(ev => ev.date === today);
  const completedEvents = events.filter(ev => new Date(ev.date) < new Date(today));
  const upcomingEvents = events.filter(ev => new Date(ev.date) >= new Date(today));

  const stats = [
    { label: 'Total Events', value: events.length, icon: '📊', className: 'total' },
    { label: 'Completed', value: completedEvents.length, icon: '✅', className: 'completed' },
    { label: 'Upcoming', value: upcomingEvents.length, icon: '⏰', className: 'upcoming' },
    { label: "Today's Events", value: todayEvents.length, icon: '📅', className: 'today' },
  ];

  const start = new Date(selectedDate);
  start.setDate(start.getDate() - start.getDay() + 1);
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    weekDates.push(d.toISOString().split('T')[0]);
  }

  let filteredEvents = events;
  if (searchTerm.trim()) {
    filteredEvents = filteredEvents.filter(ev =>
      ev.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const todayDate = new Date().toISOString().split('T')[0];
  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  switch (filterStatus) {
    case 'today':
      filteredEvents = filteredEvents.filter(ev => ev.date === todayDate);
      break;
    case 'completed':
      filteredEvents = filteredEvents.filter(ev => new Date(ev.date) < new Date(todayDate));
      break;
    case 'upcoming':
      filteredEvents = filteredEvents.filter(ev => new Date(ev.date) >= new Date(todayDate));
      break;
    case 'thisweek':
      filteredEvents = filteredEvents.filter(ev => {
        const evDate = new Date(ev.date);
        return evDate >= weekStart && evDate <= weekEnd;
      });
      break;
    default:
      break;
  }

  const eventsByDay = {};
  weekDates.forEach((date) => {
    eventsByDay[date] = filteredEvents.filter((ev) => ev.date === date);
  });

  const handleDragStart = (e, eventId) => {
    e.dataTransfer.setData('text/plain', eventId);
  };

  const handleDrop = (eventId, newDate) => {
    updateEventDate(eventId, newDate);
  };

  const goToPrevWeek = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 7);
    setSelectedDate(prev.toISOString().split('T')[0]);
  };

  const goToNextWeek = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    setSelectedDate(next.toISOString().split('T')[0]);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const trimmed = newEventTitle.trim();
    if (trimmed === '') return;
    addEvent(trimmed, newEventDate);
    setNewEventTitle('');
  };

  const weekStartFormatted = weekDates[0];
  const weekEndFormatted = weekDates[6];

  // List view
  if (viewMode === 'list') {
    const allEvents = filteredEvents.sort((a, b) => a.date.localeCompare(b.date));
    return (
      <>
        <div className="render-counter non-optimized">🐢 Non-Optimized • Renders: {renderCount}</div>
        
        <div className="stats-section">
          <div className="stats-header">
            <h2>📊 Event Overview</h2>
            <span className="stat-badge">{events.length} total events</span>
          </div>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className={`stat-card ${stat.className}`}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filter-group">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterStatus === 'today' ? 'active' : ''}`}
              onClick={() => setFilterStatus('today')}
            >
              Today
            </button>
            <button
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </button>
            <button
              className={`filter-btn ${filterStatus === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilterStatus('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`filter-btn ${filterStatus === 'thisweek' ? 'active' : ''}`}
              onClick={() => setFilterStatus('thisweek')}
            >
              This Week
            </button>
          </div>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              📅 Calendar
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List
            </button>
          </div>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          {allEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No events found</div>
          ) : (
            allEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  marginBottom: '6px',
                  borderLeft: '4px solid #ef4444',
                }}
              >
                <span>{event.title}</span>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>{event.date}</span>
              </div>
            ))
          )}
        </div>

        <form className="add-event-form" onSubmit={handleAddEvent}>
          <input
            type="text"
            placeholder="Event title..."
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
          />
          <input
            type="date"
            value={newEventDate}
            onChange={(e) => setNewEventDate(e.target.value)}
          />
          <button type="submit">➕ Add Event</button>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="render-counter non-optimized">🐢 Non-Optimized • Renders: {renderCount}</div>

      <div className="stats-section">
        <div className="stats-header">
          <h2>📊 Event Overview</h2>
          <span className="stat-badge">{events.length} total events</span>
        </div>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className={`stat-card ${stat.className}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-group">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterStatus === 'today' ? 'active' : ''}`}
            onClick={() => setFilterStatus('today')}
          >
            Today
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${filterStatus === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilterStatus('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`filter-btn ${filterStatus === 'thisweek' ? 'active' : ''}`}
            onClick={() => setFilterStatus('thisweek')}
          >
            This Week
          </button>
        </div>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            📅 Calendar
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
        </div>
      </div>

      <div className="week-nav">
        <button onClick={goToPrevWeek}>‹ Prev</button>
        <span>Week of {weekStartFormatted} – {weekEndFormatted}</span>
        <button onClick={goToNextWeek}>Next ›</button>
      </div>

      <div className="calendar-grid">
        {weekDates.map((date) => (
          <DayColumnNonOptimized
            key={date}
            date={date}
            events={eventsByDay[date] || []}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDeleteEvent={deleteEvent}
          />
        ))}
      </div>

      <form className="add-event-form" onSubmit={handleAddEvent}>
        <input
          type="text"
          placeholder="Event title..."
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
        />
        <input
          type="date"
          value={newEventDate}
          onChange={(e) => setNewEventDate(e.target.value)}
        />
        <button type="submit">➕ Add Event</button>
      </form>
    </>
  );
};

export default CalendarNonOptimized;