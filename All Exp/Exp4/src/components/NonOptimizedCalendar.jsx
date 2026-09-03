import React, { useState, useRef, useEffect } from 'react';
import DayColumnNonOptimized from './DayColumnNonOptimized';
import { useCalendar } from '../hooks/useCalendar';
import { childRenderCount, resetChildRenderCount } from '../utils/globalRenderCounter';

const NonOptimizedCalendar = () => {
  const { selectedDate, setSelectedDate, events, updateEventDate, addEvent, deleteEvent } = useCalendar();
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(selectedDate);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('calendar');

  // Reset child render counter on mount
  useEffect(() => {
    resetChildRenderCount();
  }, []);

  // Parent render count (only when component actually re‑renders)
  const parentRenderCount = useRef(0);
  parentRenderCount.current += 1;
  console.log(`🐢 Non‑Optimized: Parent render #${parentRenderCount.current}`);

  // ===== NO useMemo: Recalculates on EVERY render =====
  const weekDates = (() => {
    console.log('🐢 Non‑Optimized: Recalculating weekDates (no useMemo)');
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  })();

  // ===== NO useMemo: Recalculates on EVERY render =====
  let filteredEvents = events;
  if (searchTerm.trim()) {
    filteredEvents = filteredEvents.filter(ev => ev.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  const todayDate = new Date().toISOString().split('T')[0];
  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  switch (filterStatus) {
    case 'today': filteredEvents = filteredEvents.filter(ev => ev.date === todayDate); break;
    case 'completed': filteredEvents = filteredEvents.filter(ev => new Date(ev.date) < new Date(todayDate)); break;
    case 'upcoming': filteredEvents = filteredEvents.filter(ev => new Date(ev.date) >= new Date(todayDate)); break;
    case 'thisweek': filteredEvents = filteredEvents.filter(ev => { const d = new Date(ev.date); return d >= weekStart && d <= weekEnd; }); break;
    default: break;
  }

  // ===== NO useMemo: Recalculates on EVERY render =====
  const eventsByDay = {};
  weekDates.forEach(date => {
    eventsByDay[date] = filteredEvents.filter(ev => ev.date === date);
  });

  // ===== NO useCallback: New functions on EVERY render =====
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
    if (!trimmed) return;
    addEvent(trimmed, newEventDate);
    setNewEventTitle('');
  };

  const weekStartFormatted = weekDates[0];
  const weekEndFormatted = weekDates[6];

  const stats = (() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = events.filter(ev => ev.date === today);
    const completedEvents = events.filter(ev => new Date(ev.date) < new Date(today));
    const upcomingEvents = events.filter(ev => new Date(ev.date) >= new Date(today));
    return [
      { label: 'Total Events', value: events.length, icon: '📊', className: 'total' },
      { label: 'Completed', value: completedEvents.length, icon: '✅', className: 'completed' },
      { label: 'Upcoming', value: upcomingEvents.length, icon: '⏰', className: 'upcoming' },
      { label: "Today's Events", value: todayEvents.length, icon: '📅', className: 'today' },
    ];
  })();

  const statusMap = { 'all': 'All', 'today': 'Today', 'completed': 'Completed', 'upcoming': 'Upcoming', 'thisweek': 'This Week' };
  const statusKeys = ['all', 'today', 'completed', 'upcoming', 'thisweek'];
  const filterColorMap = { 'all': 'active-all', 'today': 'active-today', 'completed': 'active-completed', 'upcoming': 'active-upcoming', 'thisweek': 'active-thisweek' };
  const viewColorMap = { 'calendar': 'active-calendar', 'list': 'active-list' };

  // ----- LIST VIEW -----
  if (viewMode === 'list') {
    const allEvents = filteredEvents.sort((a, b) => a.date.localeCompare(b.date));
    return (
      <>
        <div className="render-counter" style={{ borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2' }}>
          <div>
            🐢 Non‑Optimized • <strong>Total Wasted Renders:</strong> <span className="highlight" style={{ color: '#dc2626' }}>{childRenderCount}</span>
            <span style={{ fontSize: '10px', color: '#dc2626', marginLeft: '12px' }}>
              (Parent renders: {parentRenderCount.current})
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#dc2626' }}>
            ⚠️ Every child re‑renders on every interaction!
          </div>
        </div>
        <div className="stats-section">
          <div className="stats-header"><h2>📊 Event Overview</h2><span className="stat-badge">{events.length} total</span></div>
          <div className="stats-grid">
            {stats.map(s => <div key={s.label} className={`stat-card ${s.className}`}><span className="stat-icon">{s.icon}</span><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>)}
          </div>
        </div>
        <div className="toolbar">
          <input className="search-input" placeholder="🔍 Search events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div className="filter-group">
            {statusKeys.map(key => <button key={key} className={`filter-btn ${filterStatus === key ? filterColorMap[key] : ''}`} onClick={() => setFilterStatus(key)}>{statusMap[key]}</button>)}
          </div>
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'calendar' ? viewColorMap['calendar'] : ''}`} onClick={() => setViewMode('calendar')}>📅 Calendar</button>
            <button className={`view-btn ${viewMode === 'list' ? viewColorMap['list'] : ''}`} onClick={() => setViewMode('list')}>📋 List</button>
          </div>
        </div>
        <div style={{ background: 'var(--bg-hover)', borderRadius: '10px', padding: '12px', marginBottom: '8px', flex: '1', overflow: 'auto' }}>
          {allEvents.length === 0 ? <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No events</div> :
            allEvents.map(ev => {
              const colors = ['#2563eb','#10b981','#f59e0b','#8b5cf6','#ef4444','#ec4899'];
              let hash = 0; for (let i=0; i<ev.title.length; i++) hash = ev.title.charCodeAt(i) + ((hash<<5)-hash);
              const color = colors[Math.abs(hash)%colors.length];
              return <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', background: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '4px', borderLeft: `4px solid ${color}` }}><span>{ev.title}</span><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{ev.date}</span></div>;
            })}
        </div>
        <form className="add-event-form" onSubmit={handleAddEvent}>
          <input type="text" placeholder="Event title..." value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} />
          <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} />
          <button type="submit">➕ Add Event</button>
        </form>
      </>
    );
  }

  // ----- CALENDAR VIEW -----
  return (
    <>
      <div className="render-counter" style={{ borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2' }}>
        <div>
          🐢 Non‑Optimized • <strong>Total Wasted Renders:</strong> <span className="highlight" style={{ color: '#dc2626' }}>{childRenderCount}</span>
          <span style={{ fontSize: '10px', color: '#dc2626', marginLeft: '12px' }}>
            (Parent renders: {parentRenderCount.current})
          </span>
        </div>
        <div style={{ fontSize: '10px', color: '#dc2626' }}>
          ⚠️ Every child re‑renders on every interaction!
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-header"><h2>📊 Event Overview</h2><span className="stat-badge">{events.length} total</span></div>
        <div className="stats-grid">
          {stats.map(s => <div key={s.label} className={`stat-card ${s.className}`}><span className="stat-icon">{s.icon}</span><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>)}
        </div>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="🔍 Search events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <div className="filter-group">
          {statusKeys.map(key => <button key={key} className={`filter-btn ${filterStatus === key ? filterColorMap[key] : ''}`} onClick={() => setFilterStatus(key)}>{statusMap[key]}</button>)}
        </div>
        <div className="view-toggle">
          <button className={`view-btn ${viewMode === 'calendar' ? viewColorMap['calendar'] : ''}`} onClick={() => setViewMode('calendar')}>📅 Calendar</button>
          <button className={`view-btn ${viewMode === 'list' ? viewColorMap['list'] : ''}`} onClick={() => setViewMode('list')}>📋 List</button>
        </div>
      </div>

      <div className="week-nav">
        <button onClick={goToPrevWeek}>‹ Prev</button>
        <span>Week of {weekStartFormatted} – {weekEndFormatted}</span>
        <button onClick={goToNextWeek}>Next ›</button>
      </div>

      <div className="calendar-grid">
        {weekDates.map((date, index) => (
          <DayColumnNonOptimized
            key={date}
            date={date}
            events={eventsByDay[date] || []}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDeleteEvent={deleteEvent}
            dayIndex={index}
          />
        ))}
      </div>

      <form className="add-event-form" onSubmit={handleAddEvent}>
        <input type="text" placeholder="Event title..." value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} />
        <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} />
        <button type="submit">➕ Add Event</button>
      </form>
    </>
  );
};

export default React.memo(NonOptimizedCalendar);