import { rest } from 'msw';

export const handlers = [
  rest.get('/api/events', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', title: 'Mock Meeting', date: '2026-08-20' },
        { id: '2', title: 'Mock Lunch', date: '2026-08-20' },
      ])
    );
  }),
];