import { Account } from "./Account";

/**
 * Bank class to manage multiple accounts.
 */
export class Bank {
    private accounts: Account[];

    constructor() {
        this.accounts = [];
    }

    public addAccount(account: Account): void {
        this.accounts.push(account);
    }

    public getAccount(accountNumber: string): Account | undefined {
        return this.accounts.find((acc) => acc.getAccountNumber() === accountNumber);
    }

    public getAllAccounts(): Account[] {
        return this.accounts;
    }
}
