import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KnowledgeBasePage } from '../../pages/KnowledgeBasePage';
import { ConversationManager } from '../../components/conversation/ConversationManager';
import { CallManagementPage } from '../../pages/CallManagementPage';

describe('System Integration Tests', () => {
  describe('Knowledge Management Integration', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should display and submit knowledge content', async () => {
      let rendered: ReturnType<typeof render> | undefined;
      
      try {
        await act(async () => {
          rendered = render(
            <>
              <KnowledgeBasePage />
              <ConversationManager />
            </>
          );
        });

        // Wait for initial render
        await act(async () => {
          await Promise.resolve();
          jest.advanceTimersByTime(1000);
        });
        
        // Verify knowledge input form exists
        const input = screen.getByTestId('knowledge-input');
        expect(input).toBeInTheDocument();
        
        // Add knowledge
        await act(async () => {
          fireEvent.change(input, { target: { value: '测试知识内容' } });
          const submitButton = screen.getByTestId('submit-knowledge');
          fireEvent.click(submitButton);
          jest.advanceTimersByTime(1000);
        });
        
        // Verify knowledge is added to the list
        await waitFor(() => {
          const knowledgeItem = screen.getByText('测试知识内容');
          expect(knowledgeItem).toBeInTheDocument();
        }, { timeout: 5000 });
      } finally {
        // Clean up
        rendered?.unmount();
      }
    });
  });

  describe('Call Management Integration', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should display scene management interface', async () => {
      let rendered: ReturnType<typeof render> | undefined;
      
      try {
        await act(async () => {
          rendered = render(
            <>
              <CallManagementPage />
              <ConversationManager />
            </>
          );
        });
        
        // Wait for initial render and async operations
        await act(async () => {
          await Promise.resolve(); // Flush microtasks
          jest.advanceTimersByTime(1000); // Advance timers for useEffect
        });

        await waitFor(() => {
          // Verify scene management tab is active
          const scenesTab = screen.getByTestId('tab-scenes');
          expect(scenesTab).toHaveClass('border-blue-500');
          
          // Verify scene management section is visible
          const sceneSection = screen.getByTestId('scene-management-title');
          expect(sceneSection).toBeInTheDocument();
          expect(sceneSection).toHaveTextContent('场景管理');
          
          // Verify scene list exists
          const sceneList = screen.getByTestId('scene-list-title');
          expect(sceneList).toBeInTheDocument();
          expect(sceneList).toHaveTextContent('场景列表');
        }, { timeout: 5000 });
      } finally {
        // Clean up
        rendered?.unmount();
      }
    });

    test('should display call metrics interface', async () => {
      let rendered: ReturnType<typeof render> | undefined;
      
      try {
        await act(async () => {
          rendered = render(
            <>
              <CallManagementPage />
              <ConversationManager />
            </>
          );
        });

        // Wait for initial render
        await act(async () => {
          await Promise.resolve();
          jest.advanceTimersByTime(1000);
        });

        // Switch to call management tab
        await act(async () => {
          const callTab = screen.getByTestId('tab-lines');
          fireEvent.click(callTab);
          jest.advanceTimersByTime(1000);
        });

        await waitFor(() => {
          // Verify call management section is visible
          const callSection = screen.getByText('外呼线路管理');
          expect(callSection).toBeInTheDocument();

          // Verify conversation context exists
          const conversationContext = screen.getByTestId('conversation-context');
          expect(conversationContext).toBeInTheDocument();
        }, { timeout: 5000 });
      } finally {
        // Clean up
        rendered?.unmount();
      }
    });
  });
});
