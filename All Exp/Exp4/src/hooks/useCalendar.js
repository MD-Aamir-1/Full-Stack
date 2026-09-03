import { useState, useCallback } from 'react';
import { getToday } from '../utils/dateUtils';

const today = getToday();

const getDateOffset = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const initialEvents = [
  { id: '1', title: 'Design review', date: getDateOffset(0) },
  { id: '2', title: 'Ship v2.3', date: getDateOffset(0) },
  { id: '3', title: '1:1 with Sam', date: getDateOffset(0) },
  { id: '4', title: 'Write proposal', date: getDateOffset(1) },
  { id: '5', title: 'Sprint planning', date: getDateOffset(2) },
  { id: '6', title: 'Client demo', date: getDateOffset(3) },
  { id: '7', title: 'Grocery run', date: getDateOffset(4) },
];

export const useCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState(initialEvents);

  const updateEventDate = useCallback((eventId, newDate) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId ? { ...ev, date: newDate } : ev
      )
    );
  }, []);

  const addEvent = useCallback((title, date) => {
    const newEvent = {
      id: Date.now().toString(),
      title,
      date,
    };
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  const deleteEvent = useCallback((eventId) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    events,
    updateEventDate,
    addEvent,
    deleteEvent,
  };
};