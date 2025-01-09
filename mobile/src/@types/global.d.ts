declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }

  interface Global {
    performance?: Performance;
  }

  interface Window {
    performance?: Performance;
  }
}

export {};
