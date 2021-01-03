// https://stackoverflow.com/questions/35756479/does-jest-support-es6-import-export

module.exports = {
  testEnvironment: 'jest-environment-node',
  // roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['json', 'lcov', 'text', 'clover']
}