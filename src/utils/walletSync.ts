/**
 * Legacy WalletSyncUtil.
 * This class is currently placeholder-only to avoid build errors.
 * Original functionality was based on a legacy wallet system.
 */
export class WalletSyncUtil {
  static async isWalletConnected(): Promise<boolean> {
    return false;
  }

  static async getConnectedAccount() {
    return null;
  }

  static async attemptReconnection(): Promise<boolean> {
    return false;
  }

  static async validateConnectionForTransaction(): Promise<{ isValid: boolean; account: any; error?: string; capabilities?: any }> {
    return {
      isValid: false,
      account: null,
      error: 'Legacy wallet utility disabled. Please use the new wallet connection system.'
    };
  }
}