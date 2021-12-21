/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = 'test'

require('jest-extended')

/**
 * See more here https://jestjs.io/docs/en/configuration.html
 */
module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/'],
  'moduleFileExtensions': ['js', 'json', 'ts'],
  'transform': {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  preset: 'ts-jest',
  rootDir: '.',
  'roots': ['<rootDir>/src/'],
  'setupFilesAfterEnv': ['jest-extended/all'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts']
}
