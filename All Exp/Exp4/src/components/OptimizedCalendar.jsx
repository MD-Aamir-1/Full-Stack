import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DayColumn from './DayColumn';
import { useCalendar } from '../hooks/useCalendar';

const OptimizedCalendar = () => {
  const { selectedDate, setSelectedDate, events, updateEventDate, addEvent, deleteEvent } = useCalendar();
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(selectedDate);
  const [renderCount, setRenderCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('calendar');

  // Only increments when events or selectedDate actually change
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log('⚡ Optimized: Re-render triggered (data changed)');
  }, [events, selectedDate]);

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

  // ===== useMemo: Recalculates only when selectedDate changes =====
  const weekDates = useMemo(() => {
    console.log('⚡ Optimized: Recalculating weekDates (useMemo)');
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

  // ===== useMemo: Recalculates only when events, searchTerm, filterStatus, selectedDate change =====
  const filteredEvents = useMemo(() => {
    console.log('⚡ Optimized: Recalculating filteredEvents (useMemo)');
    let result = events;
    if (searchTerm.trim()) {
      result = result.filter(ev => ev.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    const todayDate = new Date().toISOString().split('T')[0];
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    switch (filterStatus) {
      case 'today': result = result.filter(ev => ev.date === todayDate); break;
      case 'completed': result = result.filter(ev => new Date(ev.date) < new Date(todayDate)); break;
      case 'upcoming': result = result.filter(ev => new Date(ev.date) >= new Date(todayDate)); break;
      case 'thisweek': result = result.filter(ev => { const d = new Date(ev.date); return d >= weekStart && d <= weekEnd; }); break;
      default: break;
    }
    return result;
  }, [events, searchTerm, filterStatus, selectedDate]);

  // ===== useMemo: Recalculates only when filteredEvents or weekDates change =====
  const eventsByDay = useMemo(() => {
    console.log('⚡ Optimized: Recalculating eventsByDay (useMemo)');
    const map = {};
    weekDates.forEach(date => {
      map[date] = filteredEvents.filter(ev => ev.date === date);
    });
    return map;
  }, [filteredEvents, weekDates]);

  // ===== useCallback: Stable function references =====
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

  const statusMap = { 'all': 'All', 'today': 'Today', 'completed': 'Completed', 'upcoming': 'Upcoming', 'thisweek': 'This Week' };
  const statusKeys = ['all', 'today', 'completed', 'upcoming', 'thisweek'];
  const filterColorMap = { 'all': 'active-all', 'today': 'active-today', 'completed': 'active-completed', 'upcoming': 'active-upcoming', 'thisweek': 'active-thisweek' };
  const viewColorMap = { 'calendar': 'active-calendar', 'list': 'active-list' };

  // ----- LIST VIEW -----
  if (viewMode === 'list') {
    const allEvents = filteredEvents.sort((a, b) => a.date.localeCompare(b.date));
    return (
      <>
        <div className="render-counter" style={{ borderLeft: '4px solid #10b981' }}>
          ⚡ Optimized • Total Renders: <span className="highlight">{renderCount}</span>
          <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '12px' }}>
            (Only re‑renders when data changes)
          </span>
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
      <div className="render-counter" style={{ borderLeft: '4px solid #10b981' }}>
        ⚡ Optimized • Total Renders: <span className="highlight">{renderCount}</span>
        <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '12px' }}>
          (Only re‑renders when data changes)
        </span>
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
            isMemoEnabled={true}
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

export default React.memo(OptimizedCalendar);