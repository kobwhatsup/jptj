import { v4 as uuidv4 } from 'uuid';

interface ASRConfig {
  mode: 'stream' | 'batch';
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
}

interface ASRResponse {
  audio_info: {
    duration: number;
  };
  result: {
    text: string;
    utterances?: Array<{
      definite: boolean;
      end_time: number;
      start_time: number;
      text: string;
      words?: Array<{
        blank_duration: number;
        end_time: number;
        start_time: number;
        text: string;
      }>;
    }>;
  };
}

export class VolcanoASRService {
  private ws: WebSocket | null = null;
  private config: ASRConfig;

  constructor(config: ASRConfig) {
    this.config = config;
  }

  public async connect(): Promise<void> {
    const connectId = uuidv4();
    const wsUrl = new URL('wss://openspeech.bytedance.com/api/v3/sauc/bigmodel');
    
    // Add authentication parameters to URL
    const appId = process.env.VITE_VOLCANO_APP_ID;
    const accessToken = process.env.VITE_VOLCANO_ACCESS_TOKEN;
    
    wsUrl.searchParams.append('app_id', appId || '');
    wsUrl.searchParams.append('access_token', accessToken || '');
    wsUrl.searchParams.append('resource_id', 'volc.bigasr.sauc.duration');
    wsUrl.searchParams.append('connect_id', connectId);

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl.toString());

      this.ws.onopen = () => {
        console.log('ASR WebSocket connected');
        this.sendInitialRequest();
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data) as ASRResponse;
          if (response.result && this.config.onResult) {
            const isFinal = !response.result.utterances?.some(u => !u.definite);
            this.config.onResult(response.result.text, isFinal);
          }
        } catch (error) {
          console.error('Error parsing ASR response:', error);
          this.config.onError?.(error as Error);
        }
      };

      this.ws.onerror = (event: Event) => {
        const error = new Error('WebSocket connection failed');
        if (event instanceof ErrorEvent) {
          error.message = event.message || 'WebSocket error occurred';
        }
        console.error('ASR WebSocket error:', error.message);
        this.config.onError?.(error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('ASR WebSocket closed');
      };
    });
  }

  private sendInitialRequest(): void {
    if (!this.ws) return;

    const initialRequest = {
      app_id: process.env.VITE_VOLCANO_APP_ID,
      user_id: 'devin-outbound-robot',
      audio_format: 'wav',
      sample_rate: 16000,
      enable_punctuation: true,
      enable_timestamp: true,
      enable_word_timestamp: true,
    };

    this.ws.send(JSON.stringify(initialRequest));
  }

  private createBinaryHeader(payloadSize: number): ArrayBuffer {
    // Create a header with at least 4 bytes
    const headerBuffer = new ArrayBuffer(4);
    const headerView = new DataView(headerBuffer);
    
    // Set header fields (big-endian)
    // First byte: Version (0x01) and compression flag (0x00) combined
    headerView.setUint8(0, 0x10); // Version 1, no compression
    // Second byte: Reserved
    headerView.setUint8(1, 0x00);
    // Third and fourth bytes: Payload size (big-endian)
    headerView.setUint16(2, payloadSize, false); // false for big-endian
    
    return headerBuffer;
  }

  public sendAudioChunk(chunk: ArrayBuffer, isLast: boolean = false): void {
    if (!this.ws) {
      throw new Error('WebSocket not connected');
    }

    // Create binary header
    const header = this.createBinaryHeader(chunk.byteLength);
    
    // Combine header and audio data
    const combined = new Uint8Array(header.byteLength + chunk.byteLength);
    combined.set(new Uint8Array(header), 0);
    combined.set(new Uint8Array(chunk), header.byteLength);
    
    // Send binary frame
    this.ws.send(combined.buffer);
    
    // If this is the last chunk, send end marker
    if (isLast) {
      const endMarker = {
        is_end: true
      };
      this.ws.send(JSON.stringify(endMarker));
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
