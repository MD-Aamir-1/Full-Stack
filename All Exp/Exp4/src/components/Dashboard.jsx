import React, { useState } from 'react';
import Calendar from './Calendar';
import { useCalendar } from '../hooks/useCalendar';

const Dashboard = () => {
  const { events, selectedDate } = useCalendar();
  const [activeTab, setActiveTab] = useState('calendar');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('calendar');

  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(ev => ev.date === today);
  const thisWeekEvents = events.filter(ev => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const evDate = new Date(ev.date);
    return evDate >= start && evDate <= end;
  });
  const completedEvents = events.filter(ev => new Date(ev.date) < new Date(today));
  const upcomingEvents = events.filter(ev => new Date(ev.date) >= new Date(today));

  const stats = [
    { label: 'Total Events', value: events.length, icon: '📊' },
    { label: "Today's Events", value: todayEvents.length, icon: '📅' },
    { label: 'This Week', value: thisWeekEvents.length, icon: '📆' },
    { label: 'Completed', value: completedEvents.length, icon: '✅' },
    { label: 'Upcoming', value: upcomingEvents.length, icon: '⏰' },
  ];

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: '#f0f4f8',
    },
    sidebar: {
      width: '240px',
      background: '#ffffff',
      padding: '24px 0',
      boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
      position: 'sticky',
      top: 0,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    sidebarLogo: {
      padding: '0 24px',
      marginBottom: '32px',
      fontSize: '22px',
      fontWeight: '700',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    logoIcon: {
      fontSize: '26px',
      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      padding: '4px 6px',
      borderRadius: '10px',
      display: 'inline-block',
    },
    logoSpan: {
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    sidebarItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.15s',
      borderLeft: '3px solid transparent',
      fontSize: '14px',
      fontWeight: '500',
    },
    sidebarItemActive: {
      color: '#2563eb',
      background: '#eff6ff',
      borderLeftColor: '#2563eb',
    },
    mainContent: {
      flex: '1',
      padding: '24px 32px',
      overflow: 'auto',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    statCard: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      border: '1px solid #eef2f6',
      transition: 'all 0.15s',
      cursor: 'default',
    },
    statIcon: {
      fontSize: '24px',
      marginBottom: '8px',
    },
    statValue: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0f172a',
    },
    statLabel: {
      fontSize: '13px',
      color: '#64748b',
      fontWeight: '500',
    },
    toolbar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '20px',
      background: '#ffffff',
      padding: '16px 20px',
      borderRadius: '16px',
      border: '1px solid #eef2f6',
    },
    searchInput: {
      flex: '1',
      minWidth: '200px',
      padding: '10px 16px',
      border: '1px solid #e2e8f0',
      borderRadius: '30px',
      fontSize: '14px',
      outline: 'none',
      background: '#f8fafc',
      transition: 'all 0.2s',
    },
    filterGroup: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: '6px 16px',
      borderRadius: '30px',
      border: '1px solid #e2e8f0',
      background: '#ffffff',
      color: '#64748b',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.15s',
    },
    filterButtonActive: {
      background: '#2563eb',
      color: 'white',
      borderColor: '#2563eb',
    },
    viewToggle: {
      display: 'flex',
      gap: '4px',
      background: '#f1f5f9',
      padding: '4px',
      borderRadius: '30px',
    },
    viewButton: {
      padding: '6px 16px',
      borderRadius: '30px',
      border: 'none',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.15s',
      background: 'transparent',
      color: '#64748b',
    },
    viewButtonActive: {
      background: '#ffffff',
      color: '#2563eb',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    contentArea: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #eef2f6',
      minHeight: '400px',
    },
    chartContainer: {
      marginTop: '20px',
      padding: '20px',
      background: '#f8fafc',
      borderRadius: '12px',
    },
    barWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
    },
    barLabel: {
      width: '100px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#0f172a',
    },
    barTrack: {
      flex: '1',
      height: '24px',
      background: '#e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
    },
    barFill: {
      height: '100%',
      borderRadius: '12px',
      transition: 'width 0.6s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: '8px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'white',
    },
  };

  const sidebarItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'calendar', label: '📅 Calendar' },
    { id: 'analytics', label: '📈 Analytics' },
    { id: 'settings', label: '⚙️ Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>📊 Dashboard Overview</h2>
            <p style={{ color: '#64748b' }}>Welcome to your calendar dashboard. Here you can see all your events at a glance.</p>
            <div style={{ ...styles.statsGrid, marginTop: '20px' }}>
              {stats.map((stat) => (
                <div key={stat.label} style={styles.statCard}>
                  <div style={styles.statIcon}>{stat.icon}</div>
                  <div style={styles.statValue}>{stat.value}</div>
                  <div style={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'analytics':
        const total = events.length;
        const completed = events.filter(ev => new Date(ev.date) < new Date(today)).length;
        const upcoming = events.filter(ev => new Date(ev.date) >= new Date(today)).length;
        const maxVal = Math.max(total, 1);
        return (
          <div>
            <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>📈 Analytics</h2>
            <p style={{ color: '#64748b' }}>Event analytics and insights</p>
            <div style={styles.chartContainer}>
              <h3 style={{ marginBottom: '12px', fontSize: '16px', color: '#1e293b' }}>Event Breakdown</h3>
              <div style={styles.barWrapper}>
                <span style={styles.barLabel}>Total Events</span>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: '100%', background: '#2563eb' }}>{total}</div>
                </div>
              </div>
              <div style={styles.barWrapper}>
                <span style={styles.barLabel}>Completed</span>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${(completed / maxVal) * 100}%`, background: '#10b981' }}>{completed}</div>
                </div>
              </div>
              <div style={styles.barWrapper}>
                <span style={styles.barLabel}>Upcoming</span>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${(upcoming / maxVal) * 100}%`, background: '#f59e0b' }}>{upcoming}</div>
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#10b981', borderRadius: '4px' }}></span> Completed</span>
                <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#f59e0b', borderRadius: '4px' }}></span> Upcoming</span>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>⚙️ Settings</h2>
            <p style={{ color: '#64748b' }}>Application settings will appear here.</p>
            <div style={{ marginTop: '20px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '12px' }}>
                <strong>Optimization Mode:</strong> ⚡ Optimized
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <strong>Total Events:</strong> {events.length}
              </div>
            </div>
          </div>
        );
      case 'calendar':
      default:
        return (
          <>
            <div style={styles.toolbar}>
              <input
                style={styles.searchInput}
                type="text"
                placeholder="🔍 Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div style={styles.filterGroup}>
                {['All', 'Today', 'This Week', 'Completed', 'Upcoming'].map((status) => (
                  <button
                    key={status}
                    style={{
                      ...styles.filterButton,
                      ...(filterStatus === status.toLowerCase() ? styles.filterButtonActive : {}),
                    }}
                    onClick={() => setFilterStatus(status.toLowerCase())}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div style={styles.viewToggle}>
                <button
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === 'calendar' ? styles.viewButtonActive : {}),
                  }}
                  onClick={() => setViewMode('calendar')}
                >
                  📅 Calendar
                </button>
                <button
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === 'list' ? styles.viewButtonActive : {}),
                  }}
                  onClick={() => setViewMode('list')}
                >
                  📋 List
                </button>
              </div>
            </div>
            <div style={styles.contentArea}>
              <Calendar 
                searchTerm={searchTerm} 
                filterStatus={filterStatus} 
                viewMode={viewMode}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoSpan}>CalendarPro</span>
        </div>
        <div style={{ flex: 1 }}>
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.sidebarItem,
                ...(activeTab === item.id ? styles.sidebarItemActive : {}),
              }}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.statsGrid}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;