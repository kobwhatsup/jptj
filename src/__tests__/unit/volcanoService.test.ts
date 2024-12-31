import '@testing-library/jest-dom';
import { VolcanoASRService } from '../../lib/services/volcanoService';

// Mock environment variables
process.env.VITE_VOLCANO_APP_ID = 'test-app-id';
process.env.VITE_VOLCANO_ACCESS_TOKEN = 'test-access-token';

describe('Volcano ASR Service', () => {
  interface MockWebSocket extends WebSocket {
  send: jest.Mock;
  close: jest.Mock;
}

let mockWebSocket: MockWebSocket;
  let asrService: VolcanoASRService;
  let onResultMock: jest.Mock;
  let onErrorMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();

    // Create mock WebSocket instance
    mockWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
      readyState: 1, // WebSocket.OPEN
      url: '',
      binaryType: 'arraybuffer' as BinaryType,
      bufferedAmount: 0,
      extensions: '',
      protocol: '',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3
    } as MockWebSocket;
    
    // Mock global WebSocket
    const MockWebSocket = jest.fn().mockImplementation(() => mockWebSocket) as jest.Mock & {
      CONNECTING: number;
      OPEN: number;
      CLOSING: number;
      CLOSED: number;
    };
    
    Object.defineProperties(MockWebSocket, {
      CONNECTING: { value: 0, writable: false },
      OPEN: { value: 1, writable: false },
      CLOSING: { value: 2, writable: false },
      CLOSED: { value: 3, writable: false }
    });
    global.WebSocket = MockWebSocket as unknown as typeof WebSocket;

    onResultMock = jest.fn();
    onErrorMock = jest.fn();

    asrService = new VolcanoASRService({
      mode: 'stream',
      onResult: onResultMock,
      onError: onErrorMock,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    if (asrService) {
      asrService.disconnect();
    }
  });

  it('should establish WebSocket connection', async () => {
    const connectPromise = asrService.connect();
    
    
    // Simulate WebSocket open event
    if (mockWebSocket.onopen) {
      mockWebSocket.onopen(new Event('open'));
    }
    
    await connectPromise;
    
    expect(global.WebSocket).toHaveBeenCalledWith(expect.stringContaining('openspeech.bytedance.com'));
    expect(mockWebSocket.send).toHaveBeenCalledWith(expect.stringContaining('app_id'));
  });

  it('should handle incoming ASR results', async () => {
    const connectPromise = asrService.connect();
    if (mockWebSocket.onopen) {
      mockWebSocket.onopen(new Event('open'));
    }
    await connectPromise;
    
    const mockResponse = {
      data: JSON.stringify({
        audio_info: {
          duration: 1000
        },
        result: {
          text: '测试识别结果',
          utterances: [{
            definite: true,
            end_time: 1000,
            start_time: 0,
            text: '测试识别结果'
          }]
        }
      })
    };

    // Simulate message event
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage(new MessageEvent('message', mockResponse));
    }

    // Set up the mock implementation before triggering the event
    const mockResultPromise = new Promise<void>(resolve => {
      onResultMock.mockImplementationOnce(() => {
        resolve();
      });
    });

    // Trigger the message event immediately after setup
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage(new MessageEvent('message', mockResponse));
    }

    // Wait for the result with a reasonable timeout
    await Promise.race([
      mockResultPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Result timeout')), 5000))
    ]);

    expect(onResultMock).toHaveBeenCalledWith('测试识别结果', true);
    expect(mockWebSocket.send).toHaveBeenCalledWith(expect.stringContaining('"audio_format":"wav"'));
  });

  it('should handle WebSocket errors', async () => {
    const connectPromise = asrService.connect();
    
    // Simulate error event with proper Event object
    const mockErrorEvent = new Event('error');
    Object.defineProperty(mockErrorEvent, 'error', {
      value: new Error('WebSocket error occurred')
    });
    if (mockWebSocket.onerror) {
      mockWebSocket.onerror(mockErrorEvent);
    }

    await expect(connectPromise).rejects.toThrow('WebSocket connection failed');
    expect(onErrorMock).toHaveBeenCalled();
  });

  it('should send audio chunks correctly', async () => {
    const connectPromise = asrService.connect();
    if (mockWebSocket.onopen) {
      mockWebSocket.onopen(new Event('open'));
    }
    await connectPromise;
    
    const mockAudioData = new ArrayBuffer(1024);
    await asrService.sendAudioChunk(mockAudioData, true);

    // Verify that send was called at least twice (binary data and end marker)
    expect(mockWebSocket.send).toHaveBeenCalledTimes(3); // Initial request + audio chunk + end marker
    
    // Verify the last call was the end marker
    const lastCall = mockWebSocket.send.mock.calls[mockWebSocket.send.mock.calls.length - 1][0];
    expect(JSON.parse(lastCall)).toEqual({ is_end: true });
    
    // Verify binary data was sent (should be first call after initial request)
    const binaryCall = mockWebSocket.send.mock.calls[1][0];
    expect(binaryCall instanceof ArrayBuffer).toBeTruthy();
    expect(binaryCall.byteLength).toBe(1024 + 4); // Audio data + header
  });

  it('should disconnect WebSocket properly', async () => {
    const connectPromise = asrService.connect();
    if (mockWebSocket.onopen) {
      mockWebSocket.onopen(new Event('open'));
    }
    await connectPromise;
    
    asrService.disconnect();
    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});
