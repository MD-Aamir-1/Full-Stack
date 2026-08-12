// src/api/mockAuth.js

export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const users = [
  { id: 1, username: 'admin', password: 'pass', role: 'admin' },
  { id: 2, username: 'editor', password: 'pass', role: 'editor' },
  { id: 3, username: 'viewer', password: 'pass', role: 'viewer' },
];

let refreshTokens = {};

const generateToken = (user, expiresIn = 60) => {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
};

export const mockLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) return reject(new Error('Invalid credentials'));

      const accessToken = generateToken(user, 30);
      const refreshToken = generateToken(user, 120);
      refreshTokens[refreshToken] = user.id;

      resolve({
        accessToken,
        refreshToken,
        user: { id: user.id, username: user.username, role: user.role },
      });
    }, 500);
  });
};

export const mockRefresh = (refreshToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userId = refreshTokens[refreshToken];
      if (!userId) return reject(new Error('Invalid refresh token'));

      const user = users.find(u => u.id === userId);
      if (!user) return reject(new Error('User not found'));

      const newAccessToken = generateToken(user, 30);
      resolve({ accessToken: newAccessToken });
    }, 500);
  });
};

export const mockFetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Getting Started with React', author: 'Jane Doe', status: 'published' },
        { id: 2, title: 'Understanding JWT', author: 'John Smith', status: 'published' },
        { id: 3, title: 'Role-Based Access Control', author: 'Alice Johnson', status: 'draft' },
      ]);
    }, 300);
  });
};