module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }]
  },
  moduleDirectories: ['node_modules', 'src'],
  testTimeout: 30000,
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'import.meta': {
      env: {
        VITE_VOLCANO_APP_ID: '8048191148',
        VITE_VOLCANO_ACCESS_TOKEN: '7abXElU-PpLM0_SV-DLBzGcMgkMFSMtR',
        VITE_VOLCANO_SECRET_KEY: 'kWOiFVBJ_cK5c-7mqu_g6JLhMQD2xnbr',
        VITE_VOLCANO_TTS_APP_ID: '8048191148',
        VITE_VOLCANO_TTS_ACCESS_TOKEN: '7abXElU-PpLM0_SV-DLBzGcMgkMFSMtR',
        VITE_VOLCANO_TTS_SECRET_KEY: 'kWOiFVBJ_cK5c-7mqu_g6JLhMQD2xnbr'
      }
    }
  }
};
