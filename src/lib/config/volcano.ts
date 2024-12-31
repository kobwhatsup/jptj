export const VOLCANO_CONFIG = {
  MODEL_ENDPOINT: import.meta.env.VITE_VOLCANO_MODEL_ENDPOINT || '',
  API_KEY: import.meta.env.VITE_VOLCANO_API_KEY || '',
  DEFAULTS: {
    EMBEDDING_MODEL: 'volcano-embedding-v1',
    NLP_MODEL: 'volcano-nlp-v1',
    CONFIDENCE_THRESHOLD: 0.8,
    MAX_TOKENS: 1024,
    TEMPERATURE: 0.7
  }
};
