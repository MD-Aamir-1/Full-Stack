import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DayColumn from './DayColumn';
import { useCalendar } from '../hooks/useCalendar';

const Calendar = ({ isMemoEnabled, isCallbackEnabled, isMemoFilterEnabled }) => {
  const { selectedDate, setSelectedDate, events, updateEventDate, addEvent, deleteEvent } = useCalendar();
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(selectedDate);
  const [renderCount, setRenderCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('calendar');

  // Per‑event render counters
  const [eventRenderCounts, setEventRenderCounts] = useState({});

  // Increment total render count on every render
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // Update per‑event render counts whenever events change
  useEffect(() => {
    const newCounts = { ...eventRenderCounts };
    events.forEach(ev => {
      newCounts[ev.id] = (newCounts[ev.id] || 0) + 1;
    });
    setEventRenderCounts(newCounts);
  }, [events]);

  // Stats
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

  // Memoized week dates (useMemo)
  const weekDates = useMemo(() => {
    console.log('🔄 useMemo weekDates recalculated');
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, [selectedDate]);

  // Memoized filtered events (useMemo)
  const filteredEvents = useMemo(() => {
    console.log('🔄 useMemo filteredEvents recalculated');
    let result = events;
    if (searchTerm.trim()) {
      result = result.filter(ev =>
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
        result = result.filter(ev => ev.date === todayDate);
        break;
      case 'completed':
        result = result.filter(ev => new Date(ev.date) < new Date(todayDate));
        break;
      case 'upcoming':
        result = result.filter(ev => new Date(ev.date) >= new Date(todayDate));
        break;
      case 'thisweek':
        result = result.filter(ev => {
          const d = new Date(ev.date);
          return d >= weekStart && d <= weekEnd;
        });
        break;
      default:
        break;
    }
    return result;
  }, [events, searchTerm, filterStatus, selectedDate]);

  // Memoized events by day (useMemo)
  const eventsByDay = useMemo(() => {
    console.log('🔄 useMemo eventsByDay recalculated');
    const map = {};
    weekDates.forEach(date => {
      map[date] = filteredEvents.filter(ev => ev.date === date);
    });
    return map;
  }, [filteredEvents, weekDates]);

  // useCallback handlers
  const handleDragStart = useCallback((e, eventId) => {
    e.dataTransfer.setData('text/plain', eventId);
  }, []);

  const handleDrop = useCallback((eventId, newDate) => {
    updateEventDate(eventId, newDate);
  }, [updateEventDate]);

  const goToPrevWeek = useCallback(() => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 7);
    setSelectedDate(prev.toISOString().split('T')[0]);
  }, [selectedDate, setSelectedDate]);

  const goToNextWeek = useCallback(() => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    setSelectedDate(next.toISOString().split('T')[0]);
  }, [selectedDate, setSelectedDate]);

  const handleAddEvent = useCallback((e) => {
    e.preventDefault();
    const trimmed = newEventTitle.trim();
    if (!trimmed) return;
    addEvent(trimmed, newEventDate);
    setNewEventTitle('');
  }, [addEvent, newEventDate, newEventTitle]);

  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const statusMap = {
    'all': 'All',
    'today': 'Today',
    'completed': 'Completed',
    'upcoming': 'Upcoming',
    'thisweek': 'This Week'
  };

  const statusKeys = ['all', 'today', 'completed', 'upcoming', 'thisweek'];
  const filterColorMap = {
    'all': 'active-all',
    'today': 'active-today',
    'completed': 'active-completed',
    'upcoming': 'active-upcoming',
    'thisweek': 'active-thisweek'
  };

  const viewColorMap = {
    'calendar': 'active-calendar',
    'list': 'active-list'
  };

  // ===== LIST VIEW =====
  if (viewMode === 'list') {
    const allEvents = filteredEvents.sort((a, b) => a.date.localeCompare(b.date));
    return (
      <>
        <div className="render-counter">
          ⚡ Total Renders: <span className="highlight">{renderCount}</span> |
          <span className={isMemoEnabled ? 'memo-on' : 'memo-off'}> {isMemoEnabled ? '✅ memo ON' : '❌ memo OFF'}</span> |
          <span className={isCallbackEnabled ? 'callback-on' : 'callback-off'}> {isCallbackEnabled ? '✅ callback ON' : '❌ callback OFF'}</span> |
          <span className={isMemoFilterEnabled ? 'usememo-on' : 'usememo-off'}> {isMemoFilterEnabled ? '✅ useMemo ON' : '❌ useMemo OFF'}</span>
        </div>

        <div className="stats-section">
          <div className="stats-header">
            <h2>📊 Event Overview</h2>
            <span className="stat-badge">{events.length} total events</span>
          </div>
          <div className="stats-grid">
            {stats.map(s => (
              <div key={s.label} className={`stat-card ${s.className}`}>
                <span className="stat-icon">{s.icon}</span>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="toolbar">
          <input
            className="search-input"
            placeholder="🔍 Search events..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="filter-group">
            {statusKeys.map(key => (
              <button
                key={key}
                className={`filter-btn ${filterStatus === key ? filterColorMap[key] : ''}`}
                onClick={() => setFilterStatus(key)}
              >
                {statusMap[key]}
              </button>
            ))}
          </div>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'calendar' ? viewColorMap['calendar'] : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              📅 Calendar
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? viewColorMap['list'] : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List
            </button>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-hover)',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '8px',
          flex: '1',
          overflow: 'auto'
        }}>
          {allEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No events found. Add one below!
            </div>
          ) : (
            allEvents.map(ev => {
              const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];
              let hash = 0;
              for (let i = 0; i < ev.title.length; i++) {
                hash = ev.title.charCodeAt(i) + ((hash << 5) - hash);
              }
              const color = colors[Math.abs(hash) % colors.length];
              const renderCount = eventRenderCounts[ev.id] || 0;
              return (
                <div
                  key={ev.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '6px',
                    marginBottom: '4px',
                    borderLeft: `4px solid ${color}`,
                    alignItems: 'center'
                  }}
                >
                  <span>{ev.title}</span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{ev.date}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', background: 'var(--bg-hover)', padding: '0 6px', borderRadius: '4px' }}>
                      renders: {renderCount}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form className="add-event-form" onSubmit={handleAddEvent}>
          <input
            type="text"
            placeholder="Event title..."
            value={newEventTitle}
            onChange={e => setNewEventTitle(e.target.value)}
          />
          <input
            type="date"
            value={newEventDate}
            onChange={e => setNewEventDate(e.target.value)}
          />
          <button type="submit">➕ Add Event</button>
        </form>
      </>
    );
  }

  // ===== CALENDAR VIEW =====
  return (
    <>
      <div className="render-counter">
        ⚡ Total Renders: <span className="highlight">{renderCount}</span> |
        <span className={isMemoEnabled ? 'memo-on' : 'memo-off'}> {isMemoEnabled ? '✅ memo ON' : '❌ memo OFF'}</span> |
        <span className={isCallbackEnabled ? 'callback-on' : 'callback-off'}> {isCallbackEnabled ? '✅ callback ON' : '❌ callback OFF'}</span> |
        <span className={isMemoFilterEnabled ? 'usememo-on' : 'usememo-off'}> {isMemoFilterEnabled ? '✅ useMemo ON' : '❌ useMemo OFF'}</span>
      </div>

      <div className="stats-section">
        <div className="stats-header">
          <h2>📊 Event Overview</h2>
          <span className="stat-badge">{events.length} total events</span>
        </div>
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className={`stat-card ${s.className}`}>
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="🔍 Search events..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="filter-group">
          {statusKeys.map(key => (
            <button
              key={key}
              className={`filter-btn ${filterStatus === key ? filterColorMap[key] : ''}`}
              onClick={() => setFilterStatus(key)}
            >
              {statusMap[key]}
            </button>
          ))}
        </div>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'calendar' ? viewColorMap['calendar'] : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            📅 Calendar
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? viewColorMap['list'] : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
        </div>
      </div>

      <div className="week-nav">
        <button onClick={goToPrevWeek}>‹ Prev</button>
        <span>Week of {weekStart} – {weekEnd}</span>
        <button onClick={goToNextWeek}>Next ›</button>
      </div>

      <div className="calendar-grid">
        {weekDates.map((date, index) => (
          <DayColumn
            key={date}
            date={date}
            events={eventsByDay[date] || []}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDeleteEvent={deleteEvent}
            isMemoEnabled={isMemoEnabled}
            dayIndex={index}
            eventRenderCounts={eventRenderCounts} // pass render counts
          />
        ))}
      </div>

      <form className="add-event-form" onSubmit={handleAddEvent}>
        <input
          type="text"
          placeholder="Event title..."
          value={newEventTitle}
          onChange={e => setNewEventTitle(e.target.value)}
        />
        <input
          type="date"
          value={newEventDate}
          onChange={e => setNewEventDate(e.target.value)}
        />
        <button type="submit">➕ Add Event</button>
      </form>
    </>
  );
};

export default Calendar;