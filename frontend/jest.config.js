export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // if we create a setup file
  moduleNameMapper: {
    // Handle CSS imports (if any in components, though Tailwind is preferred)
    '\\.(css|less|scss|sass)$_': 'identity-obj-proxy',
    // Handle image imports
    '\\.(gif|ttf|eot|svg|png)$_': '<rootDir>/__mocks__/fileMock.js',
    // Alias for src directory to match Vite/JSConfig (if using absolute paths like '@/components')
    // '@/(.*)': '<rootDir>/src/$1' 
  },
  transform: {
    // Use babel-jest to transpile tests with Babel
    '^.+\\.(js|jsx|ts|tsx)$_': 'babel-jest',
  },
  // Ignore PnP-managed `node_modules` when looking for files. This also ensures that direct dependencies are used instead of relying on transitive dependencies.
  // However, for a standard npm setup, this might not be necessary or could be just 'node_modules'.
  // For now, let's keep it simple, assuming standard node_modules resolution.
  // testPathIgnorePatterns: [
  //   '/node_modules/',
  //   '/.yarn/',
  // ],
  // coveragePathIgnorePatterns: [
  //   '/node_modules/',
  //   '/.yarn/',
  // ],
}; 