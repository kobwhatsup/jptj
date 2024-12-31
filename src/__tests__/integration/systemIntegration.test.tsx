import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KnowledgeBasePage } from '../../pages/KnowledgeBasePage';
import { ConversationManager } from '../../components/conversation/ConversationManager';
import { CallManagementPage } from '../../pages/CallManagementPage';

describe('System Integration Tests', () => {
  describe('Knowledge Management Integration', () => {
    test('knowledge base updates should reflect in conversation system', async () => {
      render(<KnowledgeBasePage />);
      render(<ConversationManager />);
      
      // Add knowledge
      const input = screen.getByTestId('knowledge-input');
      fireEvent.change(input, { target: { value: '测试知识内容' } });
      const submitButton = screen.getByTestId('submit-knowledge');
      fireEvent.click(submitButton);
      
      // Verify knowledge is available in conversation
      await waitFor(() => {
        const conversationContext = screen.getByTestId('conversation-context');
        expect(conversationContext).toContainElement(screen.getByText(/测试知识内容/));
      });
    });
  });

  describe('Call Management Integration', () => {
    test('scene creation should initialize conversation context', async () => {
      render(<CallManagementPage />);
      render(<ConversationManager />);
      
      // Create new scene
      const createSceneButton = screen.getByTestId('create-scene');
      fireEvent.click(createSceneButton);
      const sceneName = screen.getByTestId('scene-name-input');
      fireEvent.change(sceneName, { target: { value: '测试场景' } });
      const saveButton = screen.getByTestId('save-scene');
      fireEvent.click(saveButton);
      
      // Verify conversation initialized with scene context
      await waitFor(() => {
        const conversationContext = screen.getByTestId('conversation-context');
        expect(conversationContext).toContainElement(screen.getByText(/测试场景/));
      });
    });

    test('conversation results should update call metrics', async () => {
      render(<CallManagementPage />);
      render(<ConversationManager />);
      
      // Simulate conversation
      const startCallButton = screen.getByTestId('start-call');
      fireEvent.click(startCallButton);
      const userInput = screen.getByTestId('user-input');
      fireEvent.change(userInput, { target: { value: '测试对话' } });
      const sendButton = screen.getByTestId('send-message');
      fireEvent.click(sendButton);
      
      // Verify metrics update
      await waitFor(() => {
        const callMetrics = screen.getByTestId('call-metrics');
        expect(callMetrics).toContainElement(screen.getByText(/成功率/));
      });
    });
  });
});
