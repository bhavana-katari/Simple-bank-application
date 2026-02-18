import { Account } from "./Account";

/**
 * SavingsAccount class that inherits from Account.
 */
export class SavingsAccount extends Account {
    public static readonly MIN_BALANCE = 1000.0;

    constructor(accountNumber: string, accountHolder: string, initialBalance: number) {
        super(accountNumber, accountHolder, initialBalance);
    }

    /**
     * Overrides withdraw to enforce minimum balance.
     */
    public withdraw(amount: number): { success: boolean; message: string } {
        if (amount > 0 && this.balance - amount >= SavingsAccount.MIN_BALANCE) {
            this.balance -= amount;
            return {
                success: true,
                message: `Withdrawn: ${amount}. New Balance: ${this.balance.toFixed(2)}`,
            };
        } else {
            return {
                success: false,
                message: `Insufficient funds or withdrawal would breach minimum balance of ${SavingsAccount.MIN_BALANCE}`,
            };
        }
    }

    /**
     * Calculates and adds interest.
     */
    public calculateInterest(rate: number): string {
        const interest = this.balance * (rate / 100);
        this.balance += interest;
        return `Interest added: ${interest.toFixed(2)}. New Balance: ${this.balance.toFixed(2)}`;
    }
}
