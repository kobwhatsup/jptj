import { v4 as uuidv4 } from 'uuid';

export interface VolcanoConfig {
  appId: string;
  accessToken: string;
  secretKey: string;
}

export interface VolcanoTTSConfig extends VolcanoConfig {
  voice?: string;
  speed?: number;
  volume?: number;
}

export const getVolcanoConfig = (): VolcanoConfig => {
  return {
    appId: import.meta.env.VITE_VOLCANO_APP_ID,
    accessToken: import.meta.env.VITE_VOLCANO_ACCESS_TOKEN,
    secretKey: import.meta.env.VITE_VOLCANO_SECRET_KEY,
  };
};

export const getVolcanoTTSConfig = (): VolcanoTTSConfig => {
  return {
    appId: import.meta.env.VITE_VOLCANO_TTS_APP_ID,
    accessToken: import.meta.env.VITE_VOLCANO_TTS_ACCESS_TOKEN,
    secretKey: import.meta.env.VITE_VOLCANO_TTS_SECRET_KEY,
    voice: 'zh_female_1',
    speed: 1.0,
    volume: 1.0,
  };
};

export const generateConnectId = (): string => {
  return uuidv4();
};
