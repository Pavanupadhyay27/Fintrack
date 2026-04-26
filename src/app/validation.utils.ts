// Simple validation utilities
export class ValidationUtils {
  static validateTransaction(description: string, amount: number): string | null {
    if (!description?.trim()) {
      return 'Please enter a description';
    }
    if (!amount || amount <= 0) {
      return 'Please enter a valid amount';
    }
    return null;
  }

  static validateInvestment(name: string, amount: number, currentValue: number, date: string): string | null {
    if (!name?.trim()) {
      return 'Please enter investment name';
    }
    if (!amount || amount <= 0) {
      return 'Please enter a valid investment amount';
    }
    if (currentValue < 0) {
      return 'Current value cannot be negative';
    }
    if (!date) {
      return 'Please select a date';
    }
    return null;
  }
}