import React from 'react';
import EventCardNonOptimized from './EventCardNonOptimized';
import { isToday } from '../utils/dateUtils';
import { incrementChildRender } from '../utils/globalRenderCounter';

const dayColors = ['#fef9e7','#fce4ec','#e8f5e9','#e3f2fd','#f3e5f5','#fff3e0','#e0f7fa'];
const darkBgColors = ['#2d1f0e','#3d1428','#1a2e1a','#112a3d','#2a1f3d','#3d2614','#0e2d33'];

const DayColumnNonOptimized = ({ date, events, onDragStart, onDrop, onDeleteEvent, dayIndex }) => {
  // Increment child render counter on EVERY render
  incrementChildRender();
  console.log(`🐢 Non‑Optimized: DayColumn ${date} rendering (NO memo)`);

  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const eventId = e.dataTransfer.getData('text/plain');
    if (onDrop) onDrop(eventId, date);
  };

  const todayClass = isToday(date) ? 'today' : '';
  const dragClass = isDragOver ? 'drag-over' : '';
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  const bgColor = isDarkMode ? darkBgColors[dayIndex % darkBgColors.length] : dayColors[dayIndex % dayColors.length];

  const dayName = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div
      className={`day-column ${todayClass} ${dragClass}`}
      style={{ background: bgColor, transition: 'background 0.3s ease, transform 0.2s ease' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="day-header">
        {dayName}
        <span className="date">{date}</span>
      </div>
      <div className="event-list">
        {events.length === 0 ? <div style={{ minHeight: '20px' }}></div> :
          events.map(ev => (
            <EventCardNonOptimized
              key={ev.id}
              event={ev}
              onDragStart={onDragStart}
              onDelete={onDeleteEvent}
            />
          ))}
      </div>
    </div>
  );
};

export default DayColumnNonOptimized;