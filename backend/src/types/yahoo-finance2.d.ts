declare module 'yahoo-finance2' {
  export function quote(symbol: string): Promise<any>;
  export function search(query: string): Promise<any>;
  export function historical(symbol: string, options?: any): Promise<any>;
} 