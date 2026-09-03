import React, { useState } from 'react';

const palette = ['#2563eb','#10b981','#f59e0b','#8b5cf6','#ef4444','#ec4899','#14b8a6','#f97316','#6366f1','#84cc16'];

const getColor = (title) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
};

const EventCard = React.memo(({ event, onDragStart, onDelete, isMemoEnabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = getColor(event.title);
  const lightColor = color + '22';
  const hoverColor = color + '44';

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', event.id);
    if (onDragStart) onDragStart(e, event.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(event.id);
  };

  console.log(`⚡ Optimized: EventCard "${event.title}" rendering (memo)`);

  return (
    <div
      className="event-card"
      style={{
        borderLeftColor: color,
        background: isHovered ? hoverColor : lightColor,
        transition: 'background 0.25s ease, transform 0.2s ease',
      }}
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{event.title}</span>
      {onDelete && <button className="delete-btn" onClick={handleDelete}>✕</button>}
    </div>
  );
}, (prevProps, nextProps) => {
  const shouldUpdate = prevProps.event !== nextProps.event ||
                       prevProps.isMemoEnabled !== nextProps.isMemoEnabled;
  if (!shouldUpdate) {
    console.log(`✅ Optimized: EventCard "${prevProps.event.title}" SKIPPED (memo)`);
  } else {
    console.log(`🔄 Optimized: EventCard "${prevProps.event.title}" WILL re-render`);
  }
  return !shouldUpdate;
});

export default EventCard;