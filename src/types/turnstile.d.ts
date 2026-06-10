interface TurnstileConfig {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
}

declare global {
  interface Window {
    turnstile?: {
      render: (selector: string, config: TurnstileConfig) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export {};
