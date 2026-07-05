module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transformIgnorePatterns: [
    "/node_modules/(?!(zustand|@tanstack|@testing-library)/)",
  ],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.[cm]?[jt]sx?$": "babel-jest",
  },
  testMatch: ["<rootDir>/src/**/__tests__/**/*.{js,jsx}", "<rootDir>/src/**/*.test.{js,jsx}"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.jsx",
    "!src/setupTests.js",
    "!src/__mocks__/**",
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
