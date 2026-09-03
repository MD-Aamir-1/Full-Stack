import { render, screen } from '@testing-library/react';
import Calendar from '../components/Calendar';

jest.mock('../hooks/useCalendar', () => ({
  useCalendar: () => ({
    selectedDate: '2026-09-02',
    setSelectedDate: jest.fn(),
    events: [{ id: '1', title: 'Test Event', date: '2026-09-02' }],
    updateEventDate: jest.fn(),
    addEvent: jest.fn(),
    deleteEvent: jest.fn(),
  }),
}));

test('renders calendar with events', () => {
  render(<Calendar />);
  expect(screen.getByText('Test Event')).toBeInTheDocument();
});

test('renders week navigation', () => {
  render(<Calendar />);
  expect(screen.getByText('‹ Prev')).toBeInTheDocument();
  expect(screen.getByText('Next ›')).toBeInTheDocument();
});