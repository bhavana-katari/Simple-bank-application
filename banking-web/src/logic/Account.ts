/**
 * Abstract class representing a general bank account.
 * Ported from Java to TypeScript.
 */
export abstract class Account {
  protected accountNumber: string;
  protected accountHolder: string;
  protected balance: number;

  constructor(accountNumber: string, accountHolder: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance = initialBalance;
  }

  public deposit(amount: number): string {
    if (amount > 0) {
      this.balance += amount;
      return `Deposited: ${amount}. New Balance: ${this.balance.toFixed(2)}`;
    } else {
      return "Invalid deposit amount.";
    }
  }

  /**
   * Abstract method for withdrawal.
   */
  public abstract withdraw(amount: number): { success: boolean; message: string };

  public getDetails() {
    return {
      accountNumber: this.accountNumber,
      accountHolder: this.accountHolder,
      balance: this.balance,
      type: this.constructor.name,
    };
  }

  public getAccountNumber(): string {
    return this.accountNumber;
  }

  public getBalance(): number {
    return this.balance;
  }
}
