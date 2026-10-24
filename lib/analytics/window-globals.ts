export interface MetaFbqFunction {
  (
    action: string,
    event: string,
    params?: Record<string, unknown>,
    options?: { eventID: string },
  ): void;
}

export interface ClarityFunction {
  (...args: unknown[]): void;
  q?: unknown[];
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: MetaFbqFunction;
    _fbq?: MetaFbqFunction;
    clarity?: ClarityFunction;
  }
}

export {};
