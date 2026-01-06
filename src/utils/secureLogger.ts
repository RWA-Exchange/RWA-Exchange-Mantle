/**
 * Secure Logging Utility
 * Prevents sensitive data from being logged in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  sanitizeData: boolean;
}

class SecureLogger {
  private config: LogConfig;

  constructor() {
    this.config = {
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      enableConsole: process.env.NODE_ENV !== 'production',
      sanitizeData: true,
    };
  }

  /**
   * Sanitize sensitive data from objects and strings
   */
  private sanitize(data: any): any {
    if (!this.config.sanitizeData) return data;

    if (typeof data === 'string') {
      return data
        .replace(/0x[a-fA-F0-9]{64}/g, '0x[REDACTED_ADDRESS]')
        .replace(/0x[a-fA-F0-9]{40}/g, '0x[REDACTED_SHORT_ADDR]')
        .replace(/"digest":\s*"[^"]+"/g, '"digest": "[REDACTED_DIGEST]"')
        .replace(/"objectId":\s*"[^"]+"/g, '"objectId": "[REDACTED_OBJECT_ID]"')
        .replace(/private[_\s]?key/gi, '[REDACTED_PRIVATE_KEY]')
        .replace(/secret/gi, '[REDACTED_SECRET]')
        .replace(/password/gi, '[REDACTED_PASSWORD]');
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {};
      
      for (const key in data) {
        if (key.toLowerCase().includes('private') || 
            key.toLowerCase().includes('secret') ||
            key.toLowerCase().includes('password')) {
          sanitized[key] = '[REDACTED]';
        } else if (key === 'digest' || key === 'objectId') {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitize(data[key]);
        }
      }
      
      return sanitized;
    }

    return data;
  }

  /**
   * Check if logging is enabled for the given level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const requestedLevelIndex = levels.indexOf(level);
    
    return requestedLevelIndex >= currentLevelIndex;
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, data?: any) {
    if (!this.shouldLog('debug') || !this.config.enableConsole) return;
    
    const sanitizedData = data ? this.sanitize(data) : undefined;
    console.log(`🔍 ${message}`, sanitizedData);
  }

  /**
   * Log general information
   */
  info(message: string, data?: any) {
    if (!this.shouldLog('info') || !this.config.enableConsole) return;
    
    const sanitizedData = data ? this.sanitize(data) : undefined;
    console.log(`ℹ️ ${message}`, sanitizedData);
  }

  /**
   * Log warnings
   */
  warn(message: string, data?: any) {
    if (!this.shouldLog('warn') || !this.config.enableConsole) return;
    
    const sanitizedData = data ? this.sanitize(data) : undefined;
    console.warn(`⚠️ ${message}`, sanitizedData);
  }

  /**
   * Log errors (always logged)
   */
  error(message: string, error?: any) {
    if (!this.config.enableConsole) return;
    
    const sanitizedError = error ? this.sanitize(error) : undefined;
    console.error(`❌ ${message}`, sanitizedError);
  }

  /**
   * Log transaction events with automatic sanitization
   */
  transaction(event: string, data?: any) {
    if (!this.shouldLog('info') || !this.config.enableConsole) return;
    
    const sanitizedData = data ? this.sanitize(data) : undefined;
    console.log(`🔗 Transaction ${event}`, sanitizedData);
  }

  /**
   * Log blockchain events with automatic sanitization
   */
  blockchain(event: string, data?: any) {
    if (!this.shouldLog('info') || !this.config.enableConsole) return;
    
    const sanitizedData = data ? this.sanitize(data) : undefined;
    console.log(`⛓️ Blockchain ${event}`, sanitizedData);
  }

  /**
   * Log property events
   */
  property(event: string, data?: any) {
    if (!this.shouldLog('info') || !this.config.enableConsole) return;
    
    const sanitizedData = data ? this.sanitize(data) : undefined;
    console.log(`🏠 Property ${event}`, sanitizedData);
  }

  /**
   * Log investment events
   */
  investment(event: string, data?: any) {
    if (!this.shouldLog('info') || !this.config.enableConsole) return;
    
    const sanitizedData = data ? this.sanitize(data) : undefined;
    console.log(`💰 Investment ${event}`, sanitizedData);
  }
}

// Export singleton instance
export const logger = new SecureLogger();

// Export for testing
export { SecureLogger };