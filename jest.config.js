module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': require.resolve(
      '@react-native-async-storage/async-storage/jest/async-storage-mock'
    ),
    '\\.(jpg|jpeg|png|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
