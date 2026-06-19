// Mock: expo-local-authentication (hardware biométrico)
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(false)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(false)),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
}));

// Mock: Firebase App
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

// Mock: Firebase Realtime Database
jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(() => ({})),
  push: jest.fn(() => Promise.resolve({ key: 'firebase-mock-id' })),
  update: jest.fn(() => Promise.resolve()),
  remove: jest.fn(() => Promise.resolve()),
  get: jest.fn(() => Promise.resolve({ exists: () => false, val: () => null })),
  set: jest.fn(() => Promise.resolve()),
  onValue: jest.fn((ref, callback) => {
    // Simula banco vazio por padrão
    callback({ exists: () => false, val: () => null });
    return jest.fn(); // retorna função de cancelamento
  }),
}));

// Mock: firebaseConfig (evita inicializar Firebase de verdade nos testes)
jest.mock('./src/services/firebaseConfig', () => ({
  db: {},
}));
