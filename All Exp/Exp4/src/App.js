import React, { useState, useEffect } from 'react';
import OptimizedCalendar from './components/OptimizedCalendar';
import NonOptimizedCalendar from './components/NonOptimizedCalendar';

// Memoize the calendar components so they don't re-render on clock ticks
const MemoizedOptimized = React.memo(OptimizedCalendar);
const MemoizedNonOptimized = React.memo(NonOptimizedCalendar);

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isOptimized, setIsOptimized] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = (dark) => {
    setIsDark(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  };

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 <span>Calendar Dashboard</span></h1>
        <div className="header-controls">
          <div className="live-clock">🕐 {formattedTime}</div>

          <div className="optimization-toggle">
            <button
              className={isOptimized ? 'active-opt' : ''}
              onClick={() => setIsOptimized(true)}
            >
              ⚡ Optimized
            </button>
            <button
              className={!isOptimized ? 'active-nonopt' : ''}
              onClick={() => setIsOptimized(false)}
            >
              🐢 Non‑Optimized
            </button>
          </div>

          <div className="theme-toggle">
            <button
              className={!isDark ? 'active' : ''}
              onClick={() => toggleTheme(false)}
            >
              ☀️
            </button>
            <button
              className={isDark ? 'active' : ''}
              onClick={() => toggleTheme(true)}
            >
              🌙
            </button>
          </div>
        </div>
      </header>

      {isOptimized ? <MemoizedOptimized /> : <MemoizedNonOptimized />}
    </div>
  );
}

export default App;