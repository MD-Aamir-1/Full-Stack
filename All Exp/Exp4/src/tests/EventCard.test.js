import { render, screen } from '@testing-library/react';
import EventCard from '../components/EventCard';

test('renders event title', () => {
  const event = { id: '1', title: 'Test Meeting', date: '2026-09-02' };
  render(<EventCard event={event} onDragStart={() => {}} />);
  expect(screen.getByText('Test Meeting')).toBeInTheDocument();
});