/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { jest, expect } from '@jest/globals';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveTextContent(text: string): R;
    }
  }
}

Object.defineProperty(global, 'jest', { value: jest });
Object.defineProperty(global, 'expect', { value: expect });
configure({ testIdAttribute: 'data-testid' });

// Mock Vite's import.meta.env
(global as any).import = {
  meta: {
    env: {
      VITE_VOLCANO_APP_ID: '8048191148',
      VITE_VOLCANO_ACCESS_TOKEN: '7abXElU-PpLM0_SV-DLBzGcMgkMFSMtR',
      VITE_VOLCANO_SECRET_KEY: 'kWOiFVBJ_cK5c-7mqu_g6JLhMQD2xnbr',
    },
  },
};
