/**
 * Secure Logging Utility for Mantle Network
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
   * Check if logging is enabled for the given level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex >= currentLevelIndex;
  }

  /**
   * Sanitize sensitive data from objects and strings
   */
  private sanitize(data: any): any {
    if (!this.config.sanitizeData) return data;

    if (typeof data === 'string') {
      return data
        // Ethereum/Mantle addresses (0x + 40 hex chars)
        .replace(/0x[a-fA-F0-9]{40}/g, '0x[REDACTED_ADDRESS]')
        // Transaction hashes (0x + 64 hex chars)
        .replace(/0x[a-fA-F0-9]{64}/g, '0x[REDACTED_TX_HASH]')
        // Contract addresses in JSON
        .replace(/"address":\s*"0x[a-fA-F0-9]{40}"/g, '"address": "0x[REDACTED_ADDRESS]"')
        .replace(/"hash":\s*"0x[a-fA-F0-9]{64}"/g, '"hash": "0x[REDACTED_HASH]"')
        .replace(/"transactionHash":\s*"0x[a-fA-F0-9]{64}"/g, '"transactionHash": "[REDACTED_TX_HASH]"')
        // Private keys and secrets
        .replace(/private[_\s]?key/gi, '[REDACTED_PRIVATE_KEY]')
        .replace(/secret/gi, '[REDACTED_SECRET]')
        .replace(/password/gi, '[REDACTED_PASSWORD]')
        .replace(/mnemonic/gi, '[REDACTED_MNEMONIC]');
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {};

      for (const key in data) {
        if (key.toLowerCase().includes('private') ||
          key.toLowerCase().includes('secret') ||
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('mnemonic')) {
          sanitized[key] = '[REDACTED]';
        } else if (key === 'hash' || key === 'transactionHash' || key === 'address') {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitize(data[key]);
        }
      }

      return sanitized;
    }

    return data;
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (!this.config.enableConsole || !this.shouldLog(level)) return;

    const sanitizedData = data ? this.sanitize(data) : undefined;
    const timestamp = new Date().toISOString();

    switch (level) {
      case 'debug':
        console.debug(`[${timestamp}] DEBUG: ${message}`, sanitizedData || '');
        break;
      case 'info':
        console.info(`[${timestamp}] INFO: ${message}`, sanitizedData || '');
        break;
      case 'warn':
        console.warn(`[${timestamp}] WARN: ${message}`, sanitizedData || '');
        break;
      case 'error':
        console.error(`[${timestamp}] ERROR: ${message}`, sanitizedData || '');
        break;
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  // Specialized logging methods
  property(message: string, data?: any) {
    this.log('info', `[PROPERTY] ${message}`, data);
  }

  wallet(message: string, data?: any) {
    this.log('info', `[WALLET] ${message}`, data);
  }

  transaction(message: string, data?: any) {
    this.log('info', `[TRANSACTION] ${message}`, data);
  }

  contract(message: string, data?: any) {
    this.log('info', `[CONTRACT] ${message}`, data);
  }

  blockchain(message: string, data?: any) {
    this.log('info', `[BLOCKCHAIN] ${message}`, data);
  }

  investment(message: string, data?: any) {
    this.log('info', `[INVESTMENT] ${message}`, data);
  }
}

// Export singleton instance
export const logger = new SecureLogger();
export { SecureLogger };