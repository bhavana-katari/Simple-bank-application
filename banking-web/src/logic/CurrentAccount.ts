import { Account } from "./Account";

/**
 * CurrentAccount class that inherits from Account.
 */
export class CurrentAccount extends Account {
    private overdraftLimit: number;

    constructor(accountNumber: string, accountHolder: string, initialBalance: number, overdraftLimit: number) {
        super(accountNumber, accountHolder, initialBalance);
        this.overdraftLimit = overdraftLimit;
    }

    /**
     * Overrides withdraw to allow for overdraft facility.
     */
    public withdraw(amount: number): { success: boolean; message: string } {
        if (amount > 0 && amount <= this.balance + this.overdraftLimit) {
            this.balance -= amount;
            return {
                success: true,
                message: `Withdrawn: ${amount}. New Balance: ${this.balance.toFixed(2)}`,
            };
        } else {
            return {
                success: false,
                message: `Withdrawal exceeds overdraft limit of ${this.overdraftLimit}`,
            };
        }
    }

    public getOverdraftLimit(): number {
        return this.overdraftLimit;
    }
}
